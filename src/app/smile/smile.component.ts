import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Point } from './point';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'

import * as tf from '@tensorflow/tfjs';
import * as brain from 'brain.js';
import { log } from 'util';


@Component({
  selector: 'app-smile',
  templateUrl: './smile.component.html',
  styleUrls: ['./smile.component.css']
})
export class SmileComponent {

  @ViewChild('MyCanvas', { static: false }) canvas: ElementRef;

  public ctx: CanvasRenderingContext2D;
  private canvasEl: HTMLCanvasElement;
  private width: number = 600;
  private height: number = 600;
  private pixel: number = 10;

  private model : tf.Sequential;
  private net : brain.NeuralNetwork; 

  
  constructor() {

    const config:any = {
      binaryThresh: 0.5,
      hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
      activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
      leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
    }
    this.net = new brain.NeuralNetwork(config);

    /*this.model = tf.sequential();
    let hidden = tf.layers.dense({
      units:900,
      inputShape:[1],
      activation:'sigmoid'
    });
    let output = tf.layers.dense({
      units:2,
      activation:'sigmoid'
    });

    this.model.add(hidden);
    this.model.add(output);

    let opt = tf.train.sgd(0.1);
    this.model.compile({optimizer:opt,loss:"meanSquaredError"});
    
    /*this.model.add(tf.layers.dense({units:256, inputShape:[900,], activation:'relu'}));
    this.model.add(tf.layers.dense({units:256, inputShape:[256,], activation:'relu'}));
    this.model.add(tf.layers.dropout({rate:0.5}));
    this.model.add(tf.layers.dense({units:128, inputShape:[256,], activation:'relu'}));
    this.model.add(tf.layers.dense({units:2, activation:'softmax'}));

    let opt = tf.train.adamax(0.1);
    this.model.compile({loss:'categorical_crossentropy', optimizer:opt, metrics:['accuracy']});*/
  } 
  
  ngAfterViewInit(): void {
    this.canvasEl = this.canvas.nativeElement;
    this.ctx = this.canvasEl.getContext('2d');
    this.canvasEl.width = this.width;
    this.canvasEl.height = this.height;

    this.captureEvents(this.canvasEl);
  }
  
  train() {
    let vector = this.getData();

    if(confirm('Positive?'))
    {
       this.teach(vector,1);
    }
    else{
       this.teach(vector,0);
    }
  }

  teach(arr:number[], result:number)
  {
    this.net.train({input:arr,output:[result]});
  }
  
  getResult()
  {
    let vector = this.getData();
    let result = this.net.run(vector);
    console.log(result);
    let realResult;
    if(result[0] > 0.5)
    {
      realResult = confirm('This emotion is positive.');
    }
    else{
      realResult = !confirm('This emotion is negative.');
    }
    
    this.teach(vector,realResult);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  drowGrid() {

    for (let x = 0; x < this.canvasEl.width; x += this.pixel) {
      this.drawLine({ X: x, Y: 0 }, { X: x, Y: this.canvasEl.height }, "blue", 1)
    }

    for (let y = 0; y < this.canvasEl.height; y += this.pixel) {
      this.drawLine({ X: 0, Y: y }, { X: this.canvasEl.width, Y: y }, "blue", 1)
    }
  }

  captureEvents(canvasElement: HTMLCanvasElement) {
    fromEvent(canvasElement, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasElement, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(canvasElement, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasElement, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasElement.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          X: res[0].clientX - rect.left,
          Y: res[0].clientY - rect.top
        };

        const currentPos = {
          X: res[1].clientX - rect.left,
          Y: res[1].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos, "red", this.pixel);

      });
  }

  drawOnCanvas(prevPos: Point, currentPos: Point, color: string, width: number) {
    if (!this.ctx) { return; }

    this.ctx.beginPath();

    if (prevPos) {
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = color;
      this.ctx.lineJoin = 'miter';
      this.ctx.lineWidth = width;
      this.ctx.moveTo(prevPos.X, prevPos.Y);
      this.ctx.lineTo(currentPos.X, currentPos.Y);
      this.ctx.stroke();
      this.ctx.arc(currentPos.X, currentPos.Y, this.pixel / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawLine(from: Point, to: Point, color: string, width: number) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineJoin = 'miter';
    this.ctx.lineWidth = width;
    this.ctx.moveTo(from.X, from.Y);
    this.ctx.lineTo(to.X, to.Y);
    this.ctx.stroke();
  }

  drawCell(point: Point, width: number, height: number) {
    this.ctx.fillStyle = 'blue';
    this.ctx.strokeStyle = 'blue';
    this.ctx.lineJoin = 'miter';
    this.ctx.lineWidth = 1;
    this.ctx.rect(point.X, point.Y, width, height);
    this.ctx.fill()
  }

  private getData():number[]
  {
    let cells = new Array<Point>();
    let vector = new Array<number>();
    for (let x = 0; x < this.canvasEl.width; x += this.pixel) {
      for (let y = 0; y < this.canvasEl.height; y += this.pixel) {
        let data = this.ctx.getImageData(x,y,this.pixel,this.pixel)

        let isNotEmpty = data.data.some(p=>p != 0)
        if(isNotEmpty)
        {
          cells.push({X:x,Y:y});
        }
        let value = isNotEmpty == true ? 1 : 0
        vector.push(value);
      }    
    }

    this.drawActualGrid(cells);

    return vector;
  }

  private drawActualGrid( cells : Array<Point>)
  {
    this.drowGrid();
    cells.forEach(cell => {
      this.drawCell(cell,this.pixel,this.pixel);
    });
  }

}
