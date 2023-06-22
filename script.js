const canvas=document.getElementById('canvas1');
const ctx=canvas.getContext('2d');
const CANVAS_WIDTH=canvas.width=400;
const CANVAS_HEIGHT=canvas.height=600;

const music=new Audio();
music.src='Easy song.mp3';

const buttonImage=new Image();
buttonImage.src='play1.png';

const buttonX=CANVAS_WIDTH/2-32;
const buttonY=CANVAS_HEIGHT/2-32;

let n=2;
let d=0;
let dot=true;
let connecting=false;
let pickedObj;
let score=0;
const font="Press Start 2P"


let gameFrame=0;

let started=false;

let win=false;
let end=false;

let canvasPosition=canvas.getBoundingClientRect();//provide info about element


class Line{
    constructor(x,y,colour){
        this.points=[];
        this.points.push({'x':x,'y':y});
        this.type="line";
        this.dot_colour=colour;
        this.markfordeletion=false;


    }
    update(){
        this.points.forEach(point=>{
            gameObjects.forEach(obj=>{
                if(obj!=pickedObj && obj.type=="dot" && obj.colour==this.dot_colour && obj.picked(point.x,point.y))
                {
                    this.markedForDeletion=true;
                    obj.markedForDeletion=true;
                    pickedObj.markedForDeletion=true;
                    score+=1;
                    //dot=true;
                    
                    
                    connecting=false;

                }
            });
            
        });
        
    }
    draw(){
        //console.log("draw line");
        
        let x1=this.points[0].x;
        let y1=this.points[0].y;
        ctx.beginPath();
        ctx.lineCap = 'round';
        //ctx.moveTo(x1, y1);
        
        //for (let i = 1; i < this.points.length -1; i++) {
        //    ctx.lineTo(this.points[i].x,this.points[i].y);
        //  }
        for (let i = 0; i < this.points.length - 1; i++) {
            let x1 = this.points[i].x;
            let y1 = this.points[i].y;
            let x2 = this.points[i + 1].x;
            let y2 = this.points[i + 1].y;
      
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
          } 
        
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#fbffff";
        ctx.stroke();
        ctx.closePath();
        
    }
    draggLine(x,y){
        this.points.push({'x':x,'y':y});
    }
    
}
class Dot{
    constructor(x,y,colour){
        this.x=x;
        this.y=y;
        this.radius=1;
        this.size=20;
        this.type="dot";
        this.colour=colour;

    }
    draw(){

        // Draw the ball
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.closePath();
        
    }
    update(){
        if(this.radius<this.size){
            this.radius+=1;
        }
    }
    picked(xi,yi){
        let minDistance=20;
        let distance = Math.sqrt((xi - this.x) ** 2 + (yi - this.y) ** 2);
        return distance < minDistance;

    }
}





window.addEventListener('click',(e)=>{
	positionX=e.x - canvasPosition.left;
	positionY=e.y - canvasPosition.top;

	
	x=positionX;//finding middle
	y=positionY;
	buttonPress(x,y);
	gameObjects.forEach(obj=>{
        if(obj.type=="dot" && obj.picked(positionX,positionY)){
            console.log("picked");
            if(!connecting){
                //start drawing line.. line will be start from the first dot and go arrownd how the mouse is moving
                gameObjects.push(new Line(positionX,positionY,obj.colour));
                connecting=true;
            
                pickedObj=obj;
            }

            
        
        }
    });
	

});

window.addEventListener('touchstart',(e)=>{
	positionX=e.x - canvasPosition.left;
	positionY=e.y - canvasPosition.top;

	
	x=positionX;//finding middle
	y=positionY;
	buttonPress(x,y);
	gameObjects.forEach(obj=>{
        if(obj.type=="dot" && obj.picked(positionX,positionY)){
            console.log("picked");
            if(!connecting){
                //start drawing line.. line will be start from the first dot and go arrownd how the mouse is moving
                gameObjects.push(new Line(positionX,positionY,obj.colour));
                connecting=true;
            
                pickedObj=obj;
            }

            
        
        }
    });
	

});




window.addEventListener('mousemove',(e)=>{
    if (connecting){
        positionX=e.x - canvasPosition.left;
	    positionY=e.y - canvasPosition.top;
        gameObjects.forEach(obj=>{
            if(obj.type=="line"){
                obj.draggLine(positionX,positionY);

            }
        });
    }
});

window.addEventListener('touchmove',(e)=>{
    if (connecting){
        positionX=e.x - canvasPosition.left;
	    positionY=e.y - canvasPosition.top;
        gameObjects.forEach(obj=>{
            if(obj.type=="line"){
                obj.draggLine(positionX,positionY);

            }
        });
    }
});


function buttonPress(x,y){
	
if(x>=buttonX && x<=buttonX+64 && y>=buttonY && y<=buttonY+64 ){
			//presh=true;
			if(!(started)){
				music.play();
				started=true;
			}

		}
		
	

}

let gameObjects=[];
//Game Loop



function animate(){
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	

	if(!end)
	{
			
			
			//gameFrame++;
			if(!started){
				ctx.drawImage(buttonImage,buttonX,buttonY,64,64);	
			}
			else{
				if( dot ){
					for(i=0;i<n;i+=2){
						let colour=getRandomNeonColor();
						let cord= getnewcordinates(canvas.width,canvas.height,gameObjects);
						let x= cord.x;
						let y= cord.y;
						gameObjects.push(new Dot(x,y,colour));
						cord= getnewcordinates(canvas.width,canvas.height,gameObjects);
						x= cord.x;
						y= cord.y;
						gameObjects.push(new Dot(x,y,colour));
					}
			
					
					dot=false;
					//n*=2;
				}
				gameObjects.forEach(obj=>{
					
					obj.update();
					obj.draw();
					
					
			
				});
				
				gameObjects=gameObjects.filter(obj=>!obj.markedForDeletion);//delete marked
			
				//ctx.font='20px Lucida Console, Monaco';
				ctx.font=`20px "${font}" ,cursive`;
				ctx.fillStyle="#f5fcff"
				ctx.fillText("Score: "+score,canvas.width/2, 50);
				//scoreui.innerHTML=score;
			
				if(gameObjects.length==0){ dot=true; d=0; n+=2; console.log("dot"); }
			}
					
						
	}
	
	requestAnimationFrame(animate);

}
animate();
music.loop=true;
function getRandomNeonColor() {
    const neonColors = ["#f72585", "#4cc9f0", "#e2e84a", "#7209b7", "#3a0ca3", "#f48c06"];
    return neonColors[Math.floor(Math.random() * neonColors.length)];
}
function getnewcordinates(canvasWidth, canvasHeight, gameObjects){
  const minDistance = 50; // Minimum distance between game objects
  let newX, newY;
  let isOverlap = true;

  while (isOverlap) {
    // Generate random coordinates within the canvas
    newX = Math.floor(Math.random() * (canvasWidth - minDistance)) + minDistance / 2;
    newY = Math.floor(Math.random() * (canvasHeight - minDistance)) + minDistance / 2;

    // Check if the new coordinates overlap with any existing game objects
    isOverlap = gameObjects.some((gameObject) => {
      const distance = Math.sqrt((newX - gameObject.x) ** 2 + (newY - gameObject.y) ** 2);
      return distance < minDistance;
    });
  }

  return  {x: newX, y: newY };
}
