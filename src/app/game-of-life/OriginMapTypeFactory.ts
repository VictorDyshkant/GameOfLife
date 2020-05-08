import { OriginMapType } from './OriginMapType';

export class OriginMapTypeFactory {
    getOriginMapType(mapType: OriginMapType, size: number): number[][] {

        let grid = this.createNewGrid(size);
        let center = Math.round(size/2);

        switch (mapType) {
            case OriginMapType.Clear :
                return grid;
            case OriginMapType.Glider:
                return this.getGlider(grid,center);
            case OriginMapType.SmallExploder:
                return this.getSmallExploder(grid,center);
            case OriginMapType.Exploder:
                return this.getExploder(grid,center);
            case OriginMapType.TenCellExploder:
                return this.getTenCellExploder(grid,center);
            case OriginMapType.Spaceship:
                return this.getSpaceship(grid,center);
        }

    }

    private createNewGrid(size: number): number[][] {
        let grid = new Array<Array<number>>(size);

        for (let i = 0; i < size; i++) {
            grid[i] = new Array(size);
            for (let j = 0; j < size; j++) {
                grid[i][j] = 0;
            }
        }

        return grid;
    }

    private getGlider(grid: number[][], center : number): number[][]
    {
        grid[center-1][center-1] = 1;
        grid[center+1][center] = 1;
        grid[center-1][center+1] = 1;
        grid[center][center+1] = 1;
        grid[center+1][center+1] = 1;

        return grid;
    }

    private getSmallExploder(grid: number[][], center : number): number[][]
    {
        grid[center][center-1] = 1;
        grid[center-1][center] = 1;
        grid[center][center] = 1;
        grid[center+1][center] = 1;
        grid[center-1][center+1] = 1;
        grid[center+1][center+1] = 1;
        grid[center][center+2] = 1;

        return grid;
    }

    private getExploder(grid: number[][], center : number): number[][]
    {
        grid[center-2][center-2] = 1;
        grid[center-2][center-1] = 1;
        grid[center-2][center] = 1;
        grid[center-2][center+1] = 1;
        grid[center-2][center+2] = 1;

        grid[center+2][center-2] = 1;
        grid[center+2][center-1] = 1;
        grid[center+2][center] = 1;
        grid[center+2][center+1] = 1;
        grid[center+2][center+2] = 1;

        grid[center][center-2] = 1;
        grid[center][center+2] = 1;

        return grid;
    }

    private getTenCellExploder(grid: number[][], center : number): number[][]
    {
        grid[center-4][center] = 1;
        grid[center-3][center] = 1;
        grid[center-2][center] = 1;
        grid[center-1][center] = 1;
        grid[center][center] = 1;
        grid[center+1][center] = 1;
        grid[center+2][center] = 1;
        grid[center+3][center] = 1;
        grid[center+4][center] = 1;
        grid[center+5][center] = 1;

        return grid;
    }

    private getSpaceship(grid: number[][], center : number): number[][]
    {
        grid[center-2][center-1] = 1;
        grid[center-2][center+1] = 1;

        grid[center-1][center-2] = 1;
        grid[center][center-2] = 1;
        grid[center+1][center-2] = 1;
        grid[center+1][center+1] = 1;
        grid[center+2][center-2] = 1;

        grid[center+2][center-1] = 1;
        grid[center+2][center] = 1;

        return grid;       
    }
}