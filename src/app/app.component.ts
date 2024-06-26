import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { Observable, debounceTime, take } from 'rxjs';
import { Photo } from './data.interface';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'display-photos';

  myForm!: FormGroup;

  photos: Photo[] = [];
  displayedPhotos: Photo[] = [];
  currentPage = 1;
  itemsPerPage = 15;
  totalItems = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.fetchPhotos();
  }

  fetchPhotos() {
    this.dataService.getPhotos().subscribe((photos) => {
      this.photos = photos;
      this.totalItems = photos.length;
      this.updateDisplayedPhotos();
    });
  }

  updateDisplayedPhotos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedPhotos = this.photos.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedPhotos();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
