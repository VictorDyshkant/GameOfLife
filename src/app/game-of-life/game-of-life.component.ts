import { Component } from '@angular/core';
import { GameOfLifeService } from "./game-of-life-service";
import { OriginMapType } from './OriginMapType'
import { OriginMapTypeFactory } from './OriginMapTypeFactory'

@Component({
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.css'],
  providers: [GameOfLifeService]
})


export class GameOfLifeComponent {

  public grid: Array<Array<number>>;
  public size: number = 60;
  public squareLenght: number = 12;
  public mapType: Array<string>;
  public count: number = 0;
  public isRun: boolean = false;
  private factory: OriginMapTypeFactory;
  private interval: any;
  private timer: number = 1000;

  constructor(private gameService: GameOfLifeService) {

    this.factory = new OriginMapTypeFactory();
    this.grid = this.factory.getOriginMapType(OriginMapType.Clear, this.size);
    this.fillMapTypes();
  }

  addCell(i: number, j: number) {
    if (this.grid[i][j] == 1) {
      this.grid[i][j] = 0;
    }
    else {
      this.grid[i][j] = 1;
    }
  }

  selectType(event: any) {
    let type = event.target.value as OriginMapType;
    this.grid = this.factory.getOriginMapType(type,this.size);
    this.count = 0;
  }

  nextIteration() {
    this.count++;
    this.grid = this.gameService.nextField(this.grid, this.size);
  }

  start() {
    this.isRun = true;
    this.interval = setInterval(()=>{
      this.nextIteration();
    },this.timer);
  }

  stop() {
    this.isRun = false;
    clearInterval(this.interval);
  }

  changeSpeed(event:any)  {
    this.timer = event.target.selectedOptions[0].value;
    this.stop();
    this.start();
  }

  private fillMapTypes() {
    this.mapType = new Array<string>();
    this.mapType.push(OriginMapType.Clear.toString());
    this.mapType.push(OriginMapType.Exploder.toString());
    this.mapType.push(OriginMapType.SmallExploder.toString());
    this.mapType.push(OriginMapType.Glider.toString());
    this.mapType.push(OriginMapType.Spaceship.toString());
    this.mapType.push(OriginMapType.TenCellExploder.toString());
  }
}
