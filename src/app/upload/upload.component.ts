import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from "@angular/core";
import { Files } from './files-data'
import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { SafePipe } from '../safe.pipe';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  [x: string]: any;
  filesData: Files[];
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  getDataFromServer = () => {
    const promise = this.http.get<Files[]>('http://localhost:3001/uploads').toPromise();
    promise.then((files) => {
      this.filesData = files;
      console.log(this.filesData);
      this.renderAllFiles();
    });
  }
  renderFiles = [];
  showImage = true;
  renderAllFiles = () => {
    this.renderFiles = [];
    const testId = document.querySelector<HTMLElement>('.test-full-details').id;
    for (var i = 0; i < this.filesData.length; i++) {
      if (testId == this.filesData[i].id) {
        if (this.filesData[i].src.startsWith("data:image")) {
          this.showImage = true;
          //Should we use DOM sanitizer???
          let url = this.encodeImageFileAsURL(this.filesData[i].src);
          this.imgSrc.push(this.sanitizer.bypassSecurityTrustUrl(url));
          this.files.push(this.filesData[i]);
        }
        if (this.filesData[i].src.startsWith("data:video")) {
          this.showImage = false;
          let url = this.encodeImageFileAsURL(this.filesData[i].src);
          this.videoSrc.push(this.sanitizer.bypassSecurityTrustUrl(url));
          this.files.push(this.filesData[i]);
        }
      }
    }
    console.log("Rendering files");
    console.log(this.files);
  }
  encodeImageFileAsURL(dataImage) {
    //Encode image URL
    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }

    const contentType = dataImage.startsWith("data:image") ? 'image/png' : 'video/webm';
    const b64Data = dataImage.split(",")[1];

    const blob = b64toBlob(b64Data, contentType);
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
  }
  ngOnInit(): void {
    this.getDataFromServer();
  }

  ngAfterViewChecked() {

  }
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  files: any[] = [];

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  imgSrc = [];
  videoSrc = [];
  parseDataURL = (files) => {
    this.videoSrc = [];
    this.imgSrc = [];
    var mediaObject = {};
    if (files.length > 0) {
      var fileToLoad = files[0];

      var fileReader = new FileReader();

      fileReader.onload = async (fileLoadedEvent) => {
        var srcData = fileLoadedEvent.target.result; // <--- data: base64
        if (srcData.toString().startsWith("data:image")) {
          var newImage = document.createElement('img');
          newImage.src = srcData.toString();

          let url = this.encodeImageFileAsURL(newImage.src);
          this.imgSrc.push(this.sanitizer.bypassSecurityTrustUrl(url));
        }

        if (srcData.toString().startsWith("data:video")) {
          var newVideo = document.createElement('video');
          newVideo.src = srcData.toString();

          let url = this.encodeImageFileAsURL(newVideo.src);
          this.videoSrc.push(this.sanitizer.bypassSecurityTrustUrl(url));
        }
        const finalUrl = typeof newImage != "undefined" ? newImage.src : newVideo.src;
        const testId = document.querySelector<HTMLElement>('.test-full-details').id;
        Object.assign(mediaObject, {
          progress: 100,
          id: testId,
          filename: fileToLoad.name,
          chunkSize: fileToLoad.size,
          src: finalUrl
        });
        this.http.post<any>('http://localhost:3001/uploads', mediaObject, {}).subscribe();
      }
      fileReader.readAsDataURL(fileToLoad);
    }
  }

  fileBrowseHandler(files) {
    this.parseDataURL(files);
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  tempFiles = this.files;
  deleteFile(index: number, event) {
    //Remove media from server
    var removeMediaObject;
    for (var i = 0; i < this.files.length; i++) {
      if (event.currentTarget.parentElement.children[2].innerText.indexOf(this.files[i].filename) > -1)
        removeMediaObject = this.files[i];
    }
    console.log(removeMediaObject);
    this.http.post<any>('http://localhost:3001/uploads/delete', removeMediaObject, {}).subscribe();

    if (this.files[index].progress < 100) {
      console.log("Upload in progress.");
      return;
    }
    this.files.splice(index, 1);

  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item['id'] = document.querySelector<HTMLElement>('.test-full-details').id;
      item.progress = 0;
      this.files.push(item);

    }
    this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  showModal = false;
  currentImgSrc;
  currentVideoSrc;
  show(event) {
    console.log(event);
    this.currentImgSrc = '';
    this.currentVideoSrc = '';
    if (typeof event.srcElement.currentSrc != "undefined" && event.target.localName == "img") {
      this.showImage = true;
      this.currentImgSrc = this.sanitizer.bypassSecurityTrustUrl(event.srcElement.currentSrc);
    }
    if (typeof event.srcElement.currentSrc != "undefined" && event.target.localName == "video") {
      this.currentVideoSrc = this.sanitizer.bypassSecurityTrustUrl(event.srcElement.currentSrc);
      this.showImage = false;
    }
    this.showModal = true; // Show-Hide Modal Check
  }
  //Bootstrap Modal Close event
  hide(event) {
    this.showModal = false;
  }
}