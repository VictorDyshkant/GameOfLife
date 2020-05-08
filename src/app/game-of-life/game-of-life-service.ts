import { Injectable } from '@angular/core';

export interface IGameOfLifeService
{
  nextField (grid : number[][], sizeOfNewGrid : number) : number[][];
  countNeighbors(grid : number[][], i : number, j : number) :number;
}

@Injectable() 
export class GameOfLifeService implements IGameOfLifeService{

  nextField(grid: number[][], sizeOfNewGrid : number) : number[][] {
    
    let diff = Math.round((sizeOfNewGrid - grid.length) / 2);
    let newGrid = this.createNewGrid(sizeOfNewGrid);

    let sizeofCount = sizeOfNewGrid;
    if(diff >= 0)
    {
      sizeofCount = grid.length;
    }

      for(let i = 0; i < sizeofCount; i++)
      {
        for(let j = 0; j < sizeofCount; j++)
        {
          let sum = this.countNeighbors(grid,i,j);
          if((sum == 2 || sum == 3) && grid[i][j] == 1)
          {
            newGrid[i+diff][j+diff] = 1;
          }
          else if(sum == 3 && grid[i][j] == 0)
          {
            newGrid[i+diff][j+diff] = 1;
          }
        }
      }

      return newGrid;
  }

  private createNewGrid(size : number) : number[][]
  {
    let grid = new Array<Array<number>>(size);
    for(let i = 0; i < size; i++)
    {
      grid[i] = new Array(size); 
      for(let j = 0; j < size; j++)
      {
        grid[i][j] = 0;
      }
    }

    return grid;
  }

  countNeighbors(grid: number[][], x: number, y: number): number {
    let sum : number = 0;

    for(let i = x - 1; i < x + 2; i++)
    {
      for(let j = y - 1; j < y + 2; j++)
      {
        if(i >= 0 && j >= 0 && i < grid.length && j < grid.length)
        {
          console.log()
          sum += grid[i][j];
        }
      }
    }

    sum = sum - grid[x][y];

    return sum;
  }
}