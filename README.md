# Json to Typescript Interface converter
###### Json to typescript interface converter app based on Angular 7 and Bootstrap.
#### Input Json
![Alt text](/src/assets/screen-2.PNG?raw=true "Json to typescript converter")
#### Output Interface 
![Alt text](/src/assets/screen-1.PNG?raw=true "Json to typescript converter")

 # Demo 
You can have a look demo at the demo at : https://shahkarahmed.github.io/json-to-typescript-converter

# Adding the component in your project
`<json-to-ts></json-to-ts>`

# Dependencies
`npm install --save bootstrap
npm install --save jquery
npm install --save popper`

# App Details
App can be used to convert a json object to typescript interface.
User can copy a json object and paste into the 'Json Input' clipboard and click on convert button to generate the interface.

### json-to-ts.component.html
```html
<nav class="navbar navbar-dark bg-dark ">
  <span class="navbar-brand mb-0 h1 mx-auto">Json To Interface Generator </span>
</nav>

<form>
  <div class="container form-group">
    <div class="row">
      <div class="col-sm">
        <div class="form-group">
          <label for="exampleFormControlTextarea1">Json Input:</label>
          <textarea
            name="jsonInput"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="10"
            [(ngModel)]="jsonInput"
          ></textarea>
        </div>
      </div>

      <div class="col-sm  wrapper ">
        <div class="form-group align-middle ">
          <button
            type="button"
            class="btn btn-primary"
            (click)="generateTypescript()"
          >
            Convert
          </button>
        </div>
      </div>

      <div class="col-sm">
        <div class="form-group">
          <label for="exampleFormControlTextarea1">Generate Interface:</label>
          <textarea
            name="interface"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="10"
            [(ngModel)]="outputString"
          ></textarea>
        </div>
      </div>
    </div>
    
  </div>
  <div class="row">
      <div class="col-sm"> </div>
    <div class="col-sm"><div *ngIf='errorMsg' style="background-color:aliceblue; text-align: center ; color : red"> ERROR : {{errorMsg}}</div></div>
    <div class="col-sm"> </div>
  </div>
</form>
```
### json-to-ts.component.ts
```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'json-to-ts',
  templateUrl: './json-to-ts.component.html',
  styleUrls: ['./json-to-ts.component.css']
})
export class JsonToTsComponent implements OnInit {

  public title = 'jsonToInterface';
  public jsonInput;
  public outputString : string;
  public errorMsg : string;
  private interfaceData: any[];

  private interfaces: any;
  private copyInput;
  private types: string[];

  ngOnInit() {
    this.jsonInput = '';
    this.outputString ='';
    this.errorMsg =''
    this.interfaceData = [];
    this.interfaces = [];
    this.types = [];
  }

 private retrieveObjects(jsonOutput) : void {
    for (let obj in jsonOutput) {
      if (jsonOutput.hasOwnProperty(obj)) {
        if (
          jsonOutput[obj] === null ||
          jsonOutput[obj] === undefined ||
          jsonOutput[obj].constructor === Number ||
          jsonOutput[obj].constructor === String ||
          jsonOutput[obj].constructor === Boolean ||
          jsonOutput[obj].constructor === Array
        ) {
          continue;
        } else if (jsonOutput[obj].constructor === Object) {
          

          let type = this.generateType(obj).toUpperCase();
          this.addToInterfaces(
            {
              type: type,
              value: jsonOutput[obj]
            },
            type
          );
          this.retrieveObjects({ ...jsonOutput[obj] });
        }
      }
    }
  }
  private generateType(key: string): string {
    for (let k in this.types) {
      if (this.types[k] == key.toUpperCase()) {
        let str: any = this.types[k];
        str = str.substring(str.length - 1, str.length);
        if (isNaN(str)) {
          key = key.concat('1');
        } else {
          str++;
          key = key.concat(str);
        }
      }
    }
    return key;
  }

  private addToInterfaces(objToAdd, type) {
    for (let key in this.interfaces) {
      if (this.compareKeys(objToAdd.value, this.interfaces[key].value)) {
        return;
      }
    }
    this.interfaces.push(objToAdd);
    this.types.push(type);
  }
  compareKeys(a, b): boolean {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
  }
  
  public generateTypescript() : void {
    try{
    this.outputString ='';
    this.errorMsg ='';
    let jsonOutput = JSON.parse(this.jsonInput);

    this.interfaces.push({ type: 'RootObject', value: jsonOutput });
    this.retrieveObjects({ ...jsonOutput });

    for (let key in this.interfaces) {
      let temp = { ...this.interfaces[key] };
      this.replaceType(temp);      
    }

    for (let key in this.interfaceData) {
      let temp = { ...this.interfaceData[key] };
      this.outputString = this.outputString.concat(this.convertToInterface(temp) + "\n");
    }
  }
  catch(error ){
this.errorMsg = error.message;
  }
    this.interfaceData = [];
    this.interfaces = [];
    this.types = [];
  }
 private replaceType(jsonObj): void {
    let jsonInput = { ...jsonObj.value };
    let objectChanged: boolean = false;
    let temp: any = {
      ...jsonObj
    };

    for (let obj in jsonInput) {
      if (jsonInput.hasOwnProperty(obj)) {
        if (
          jsonInput[obj] === null ||
          jsonInput[obj] === undefined ||
          jsonInput[obj].constructor === Number ||
          jsonInput[obj].constructor === String ||
          jsonInput[obj].constructor === Boolean ||
          jsonInput[obj].constructor === Array
        ) {
          continue;
        } else if (jsonInput[obj].constructor === Object) {
          for (let key in this.interfaces) {
            if (this.compareKeys(this.interfaces[key].value, jsonInput[obj])) {
              temp.value[obj] = this.interfaces[key].type;
              objectChanged = true;
            }
          }
        }
      }
    }
    if (!objectChanged) {
      this.interfaceData.push(jsonObj);
    } else {
      this.interfaceData.push(temp);
    }
  }
  private convertToInterface(object): string {
    try {
      let output = `export interface ${object['type']}{ 
        `;
      const temp = object.value;     
      for (let key in temp) {
        if (temp[key] === null || temp[key] === undefined) {
          output = output.concat(key + '? : any;\n');
        } else if (temp[key].constructor === Number) {
          output = output.concat(key + ' : number;\n');
        } else if (temp[key].constructor === String) {
          if (this.types.indexOf(temp[key]) > -1) {
            output = output.concat(key + ' : ' + temp[key] + ';\n');
          } else {
            output = output.concat(key + ' : string;\n');
          }
        } else if (temp[key].constructor === Boolean) {
          output = output.concat(key + ' : boolean;\n');
        } else if (temp[key].constructor === Array) {
          output = output.concat(key + ' : any[];\n');
        } else if (temp[key].constructor === Object) {
        }
      }
      output = output.concat('}');
      return output;
    } catch (error) {
        throw new Error('Something went wrong!');
    }
  }

}
```
