import { Component, ViewChild, AfterViewInit, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Path } from '../../interfaces/path';


@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements AfterViewInit {
   
  //SSR checkings --- start
  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private renderer2: Renderer2) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  //SSR checkings --- end
  
  
  @ViewChild('canvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;
  public ctx!: any;

  //default details
  public context: CanvasRenderingContext2D | null = null; 
  public bgImage = "https://png.pngtree.com/png-vector/20230531/ourmid/pngtree-yummy-kawaii-coloring-pages-vector-png-image_6784260.png";
  public penColor:string = '#000000';
  public penThickness: number = 0;
  public selectedTool: string = 'pen';
  public selectedColor: string = '#000000';
  public backgroundImage!: HTMLImageElement;  //used for canvas background
  public canvasWidth: number = 700;
  public canvasHeight: number = 600;

  //toggle for drawing state
  public isDrawing: boolean = false;
  public paths: Path[] = [];

  startDrawing(event: MouseEvent, color: string, thickness: number ): void{

    console.log("STARTING TO DRAW")

    // set drawing to true
    this,this.isDrawing = true;
    const path = new Path2D();

    //set the path coords
    path.moveTo(event.offsetX, event.offsetY);
    
    //create the path
    const newPath = {
      path,
      color,
      thickness,
    } as unknown as Path;

    //add it to the paths array
    this.paths.push(newPath);

  }

  endDrawing(): void {
    this.isDrawing = false;
  }

  draw( event: MouseEvent ): void {

    if(this.isDrawing){
      //get the last path
      const currPath = this.paths[this.paths.length - 1];

      //use it to draw a line
      currPath.path.lineTo(event.offsetX, event.offsetY);

      //set details
      this.ctx.strokeStyle = currPath.color; //set the color of the path
      this.ctx.lineWidth = currPath.thickness; //set the line thickness
      this.ctx.stroke(currPath.path); //draw the path to the canvas
    }
    
  }


  clearCanvas(){
    console.log("CLEARING CANVAS...")
    if(this.context){
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      const backgroundImage = new Image();
      backgroundImage.src= this.bgImage; // set a background image to use
     
      //load the image
      backgroundImage.onload = () => {
        this.ctx.drawImage(
          backgroundImage,
          0,
          0,
          this.canvas.nativeElement.width,
          this.canvas.nativeElement.height
        );
       
      }
    }

    //clear the paths array
    this.paths = [];
    
  }


  changeThickness(value: number): void{
    this.penThickness = value;
    this.ctx.lineWidth = this.penThickness;
  }


  changeColor(event: any):void {
    //parse into an element input and get the value
    let color = event.target as HTMLInputElement;
    this.selectedColor = color.value;
    this.ctx.strokeStyle = this.selectedColor;
    
  }

  revertLastChange(){
    //check we have at least one path
    if(this.paths.length > 0){
      //remove the last past
      this.paths.pop();

      //clean the canvas and redo the image
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      //draw the background again
      const backgroundImage = new Image();
      backgroundImage.src= this.bgImage; // set a background image to use
     
      //load the image
      backgroundImage.onload = () => {
        this.ctx.drawImage(
          backgroundImage,
          0,
          0,
          this.canvas.nativeElement.width,
          this.canvas.nativeElement.height
        );
       
      }


      //draw the paths again
      this.paths.map((path) => {
        this.ctx.strokeStyle = path.color;
        this.ctx.lineWidth = path.thickness;
        this.ctx.stroke(path.path);
      });


    }
 
 
 
  }
  
  





  ngAfterViewInit(): void {

    if(this.isBrowser){
      console.log(this.canvas)
      this.context = this.canvas.nativeElement.getContext('2d');
      this.ctx = this.canvas.nativeElement.getContext('2d');
  
      const backgroundImage = new Image();
      backgroundImage.src= this.bgImage; // set a background image to use
     
      //load the image
      backgroundImage.onload = () => {
        this.ctx.drawImage(
          backgroundImage,
          0,
          0,
          this.canvas.nativeElement.width,
          this.canvas.nativeElement.height
        );
       
      }
    }
    
  }

}
