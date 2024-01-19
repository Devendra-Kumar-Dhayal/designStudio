import {spacing} from "./constants";
import { attachLineToShape,attachLineToShapeCircle } from "./attachShapes";

export function calculateDistance(x1, y1, x2, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
  
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  
    return distance;
  }
export function distanceFromLine(x0, y0, x1, y1, x2, y2) {
    // Calculate A, B, and C for the line
    const A = y2 - y1;
    const B = x1 - x2;
    const C = x2 * y1 - x1 * y2;
  
    // Calculate the distance using the formula
    const numerator = Math.abs(A * x0 + B * y0 + C);
    const denominator = Math.sqrt(A * A + B * B);
  
    const distance = numerator / denominator;
  
    return distance;
  }
  
export function findElement(arr, label1) {
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
  
      // If the element is not in the hash table, add it to the uniqueArray
      if (element.type !== "line") {
        if (element.options.meta.common.label === label1) {
          return element;
        }
      }
    }
  }
export function UniqueArray(arr,seen){
    const uniqueArray = [];
    const collisionFreeArray = [];
    // rendering queue
  
    for (let i = 0; i < arr.length; i++) {
      let element = arr[i];
  
      // If the element is not in the hash table, add it to the uniqueArray
      if (element.type !== "line") {
        if (!seen[element.options.meta.common.label]) {
          uniqueArray.push(element);
          seen[element.options.meta.common.label] = true;
        }
      }
    }
    return {uniqueArray,seen};
  }
export function nodeCollisionRemover(uniqueArray){
    for (let i = 0; i < uniqueArray.length - 1; i++) {
      for (let j = i + 1; j < uniqueArray.length; j++) {
        let element1 = uniqueArray[i];
        let element2 = uniqueArray[j];
        if (element1.type === "rectangle") {
          if (element2.type === "rectangle") {
            // removing collsion between reactangle and reactangle
            let dist = calculateDistance(
              (element1.x1 + element1.x2) / 2,
              (element1.y1 + element1.y2) / 2,
              (element2.x1 + element2.x2) / 2,
              (element2.y1 + element2.y2) / 2
            );
            if (dist < spacing) {
              let ratio = spacing / dist;
              let newCord = [
                (element1.x1 + element1.x2) / 2 +
                  ratio *
                    ((element2.x1 + element2.x2) / 2 -
                      (element1.x1 + element1.x2) / 2),
                (element1.y1 + element1.y2) / 2 +
                  ratio *
                    ((element2.y1 + element2.y2) / 2 -
                      (element1.y1 + element1.y2) / 2),
              ];
              element2.x1 = newCord[0] - 100;
              element2.y1 = newCord[1] - 100;
              element2.x2 = newCord[0] + 100;
              element2.y2 = newCord[1] + 100;
            }
          } else {
            let dist = calculateDistance(
              (element1.x1 + element1.x2) / 2, // removing collsion between reactangle and any circle
              (element1.y1 + element1.y2) / 2,
              element2.x1,
              element2.y1
            );
            if (dist < spacing) {
              let ratio = spacing / dist;
              let newCord = [
                (element1.x1 + element1.x2) / 2 +
                  ratio * (element2.x1 - (element1.x1 + element1.x2) / 2),
                (element1.y1 + element1.y2) / 2 +
                  ratio * (element2.y1 - (element1.y1 + element1.y2) / 2),
              ];
              element2.x1 = newCord[0];
              element2.y1 = newCord[1];
            }
          }
        } else {
          if (element2.type === "rectangle") {
            let dist = calculateDistance(
              // removing collsion between circle and rectangle
              element1.x1,
              element1.y1,
              (element2.x1 + element2.x2) / 2,
              (element2.y1 + element2.y2) / 2
            );
            if (dist < spacing) {
              let ratio = spacing / dist;
              let newCord = [
                element1.x1 +
                  ratio * ((element2.x1 + element2.x2) / 2 - element1.x1),
                element1.y1 +
                  ratio * ((element2.y1 + element2.y2) / 2 - element1.y1),
              ];
              element2.x1 = newCord[0] - 100;
              element2.y1 = newCord[1] - 100;
              element2.x2 = newCord[0] + 100;
              element2.y2 = newCord[1] + 100;
            }
          } else {
            let dist = calculateDistance(
              element1.x1, // removing collsion between any circle and any circle
              element1.y1,
              element2.x1,
              element2.y1
            );
            if (dist < spacing) {
              let ratio = spacing / dist;
              let newCord = [
                element1.x1 + ratio * (element2.x1 - element1.x1),
                element1.y1 + ratio * (element2.y1 - element1.y1),
              ];
              element2.x1 = newCord[0];
              element2.y1 = newCord[1];
            }
          }
        }
      }
    }
    return uniqueArray;
  }
  
export function updateLine(arr, uniqueArray,seen){
    for (let i = 0; i < arr.length; i++) {
      let element = arr[i];
  
      // If the element is not in the hash table, add it to the uniqueArray
      if (element.type === "line") {
        if (!seen[element.options.meta.common.label]) {
          for (let j = 0; j < 2; j++) {
            var ele = findElement(uniqueArray, element.options.depending[j].name);
            if (ele.type === "rectangle") {
              const { x, y } = attachLineToShape(
                ele,
                element,
                element.options.depending[j].start
              );
              if (element.options.depending[j].start) {
                element = {
                  ...element,
                  x1: x,
                  y1: y,
                };
              } else {
                element = {
                  ...element,
                  x2: x,
                  y2: y,
                };
              }
            } else {
              const { x, y } = attachLineToShapeCircle(
                ele,
                element,
                element.options.depending[j].start
              );
              if (element.options.depending[j].start) {
                // element.x1 = x;
                // element.y1 = y;
                element = {
                  ...element,
                  x1: x,
                  y1: y,
                };
              } else {
                // element.x2 = x;
                // element.y2 = y;
                element = {
                  ...element,
                  x2: x,
                  y2: y,
                };
              }
            }
          }
          uniqueArray.push(element);
          seen[element.options.meta.common.label] = true;
        }
      }
    }
    return {uniqueArray,seen};
  }
export function removeRepeatingValues(arr) {
    
    console.log(spacing);
    let seen = {};
    
    
    let out = UniqueArray(arr,seen);
    
    console.log("hello unique error",out.uniqueArray, out.seen);
    
    
    let uniqueArray = nodeCollisionRemover(out.uniqueArray);//node collision removal

    console.log("hello unique errorc dede",out.uniqueArray, out.seen);

    let uniqueArray1 = updateLine(arr,uniqueArray,out.seen).uniqueArray;// update line location

    console.log("hello unique errorc dede3244",uniqueArray1);
    return uniqueArray1;
  }