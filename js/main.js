document.addEventListener('DOMContentLoaded',()=>{
    const gridDisplay=document.getElementById('grid');
    const width=4;
    const tileSize=60;
    let grid=[];
    let tileId=0;

    function initGrid() {
        for (let i=0; i<width; i++){
            grid[i]=[];
            for(let j=0; j<width; j++){
                grid[i][j]=null;
            }
        }
        addNewTile();
        addNewTile();
    }

    function addNewTile(){
        let emptyCells=[];
        for(let i=0; i<width; i++){
            for(let j=0; j<width;j++){
                if (grid[i][j]===null){
                    emptyCells.push({x:i, y:j});
                }
            }
        }
        if(emptyCells.length===0){
            return
        }
        let randomCell=emptyCells[Math.floor(Math.random()*emptyCells.length)];
        let value=Math.random()<0.9?2:4;
        
        let tile=createTile(value);
        grid[randomCell.x][randomCell.y]=tile;
        setTilePosition(tile,randomCell.x,randomCell.y);
    }
    function createTile(value){
        let tile=document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-value',value);
        tile.innerHTML=value;
        tile.id='tile-'+tileId++;
        gridDisplay.appendChild(tile);
        return tile;
    }

    function setTilePosition(tile, x,y){
        tile.style.transform=`translate(${y*tileSize}px,${x*tileSize}px)`;
    }
    function move(direction){
        let hasMoved=false;
        let canMerge=[];
        for(i=0; i<width; i++){
            canMerge[i]=[];
            for(let j=0;j<width;j++){
                canMerge[i][j]=true;
            }
        }
        let startRow=direction==='up'?0:width-1;
        let endRow=direction==='up'?width:-1;
        let stepRow=direction==='up'?1:-1;

        let startCol=direction==='left'?0:width-1;
        let endCol=direction==='left'?width:-1;
        let stepCol=direction==='left'?1: -1;

        let iterate=(callback)=>{
            if (direction==='up'|| direction==='down'){
                for (let i=startRow;i!==endRow; i+=stepRow){
                    for (let j=0; j<width; j++){
                        callback(i,j);
                    }

                }
            }else{
                for (let i=0; i<width;i++){
                    for (let j = startCol; j !== endCol; j += stepCol) {
                        callback(i,j);
                     }
                }
            }


        }

        iterate((i,j)=>{
            let x=i;
            let y=j;
            let tile=grid[x][y];
            if (tile===null){
                return;
            }

            let newX=x;
            let newY=y;

            while(true){
                let nextX=newX+(direction==='up'?-1:direction==='down'?1:0);
                let nextY=newY+(direction==='left'?-1:direction==='right'?1:0);

                if(nextX<0 || nextX>=width || nextY<0 || nextY>=width) break;

                if(grid[nextX][nextY]===null){
                    grid[nextX][nextY]=tile;
                    grid[newX][newY]=null;
                    newX=nextX;
                    newY=nextY;
                    setTilePosition(tile,newX,newY);
                    hasMoved=true;
                }else if(canMerge[nextX][nextY]&&grid[nextX][nextY].innerHTML===tile.innerHTML){
                    let mergedValue=parseInt(tile.innerHTML)*2;
                    gridDisplay.removeChild(grid[nextX][nextY]);
                    grid[nextX][nextY]=tile;
                    grid[newX][newY]=null;
                    tile.innerHTML=mergedValue;
                    tile.setAttribute('data-value', mergedValue);
                    setTilePosition(tile,nextX,nextY);
                    canMerge[nextX][nextY]=false;
                    hasMoved=true;
                    break;
                }else{
                    break;
                }
            }
        });

        if (hasMoved) {
            setTimeout(() => {
                addNewTile();
                checkForGameOver();
            }, 200);

        }
    }
    function control(e) {
        switch (e.key) {
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowUp':
                move('up');
                break;
            case 'ArrowRight':
                move('right');
                break;
            case 'ArrowDown':
                move('down');
                break;
            default:
                break;
        }
    }
    
    document.addEventListener('keyup', control);

    function checkForGameOver(){
        let movesAvailable=false;
        for (let i=0;i<width;i++){
            for(let j=0; j<width; j++){
                if (grid[i][j]===null){
                    movesAvailable=true;
                    break;
                }
                
                if (j<width-1&&grid[i][j].innerHTML===grid[i][j+1]?.innerHTML){
                    movesAvailable=true;
                    break;
                }
                if (i<width-1&&grid[i][j].innerHTML===grid[i+1][j]?.innerHTML){
                    movesAvailable=true;
                    break;
                }
            }

            if (movesAvailable){
                break;
            }
        }
        if (!movesAvailable){
            alert('Game Over');
            document.removeEventListener('keyup',control);
        }
    }


    initGrid();
});


    