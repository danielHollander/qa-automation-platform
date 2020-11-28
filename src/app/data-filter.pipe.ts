import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

  // transform(textFields: string[], searchWord: any): any {
  //   debugger;
  //   return textFields.filter((val, index, arr) => {
  //     debugger;
  //     const key = typeof searchWord != "undefined" ? (searchWord.target.value.length == 0 ? searchWord.key : searchWord.target.value.toLowerCase()) : '';
  //     if (typeof searchWord != "undefined") {
  //       if (searchWord.target.parentElement.children[2].value == "Test ID" && key == val[0])
  //         return val;
  //       if (searchWord.target.parentElement.children[2].value == "Test Date and Time" && val[1].indexOf(key) > -1)
  //         return val;
  //       if (searchWord.target.parentElement.children[2].value == "Test Name" && val[2].toLowerCase().indexOf(key) > -1)
  //         return val;
  //       if (searchWord.target.parentElement.children[2].value == "Test Status" && key == val[3])
  //         return val;
  //       if (searchWord.target.parentElement.children[2].value == "Test Status" && key == "success" && val[3] == "1")
  //         return val;
  //       if (searchWord.target.parentElement.children[2].value == "Test Status" && key == "failed" && val[3] == "1")
  //         return val;
  //       if (searchWord.target.parentElement.children[2].value == "Test Duration" && key == val[4])
  //         return val;
  //       if (searchWord.target.value == "")
  //         return val;
  //     } else
  //       return val;
  //   });
  // }
  transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
    if (typeof items != "undefined") {
      return items.filter(item => {
        if (typeof filter != "undefined") {
          let notMatchingField = Object.keys(filter)
            .find(key => item[key] != filter[key]);
          return !notMatchingField;
        }
        else
          return item;
      });
    }
  }
}
