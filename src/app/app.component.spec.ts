import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    dataService = jasmine.createSpyObj('DataService', ['getPhotos']);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [AppComponent],
      providers: [{ provide: DataService, useValue: dataService }],
    }).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'display-photos'`, () => {
    expect(component.title).toEqual('display-photos');
  });

  it(`should initialize photos and totalItems on ngOnInit`, () => {
    const mockPhotos = [
      {
        albumId: 1,
        id: 1,
        title: 'Photo 1',
        url: 'url1',
        thumbnailUrl: 'url1',
      },
      {
        albumId: 2,
        id: 2,
        title: 'Photo 2',
        url: 'url2',
        thumbnailUrl: 'url2',
      },
    ];

    dataService.getPhotos.and.returnValue(of(mockPhotos));

    component.ngOnInit();
    expect(component.photos).toEqual(mockPhotos);
    expect(component.totalItems).toEqual(mockPhotos.length);
    expect(component.currentPage).toEqual(1); // Assuming default is first page
    expect(component.itemsPerPage).toEqual(15); // Assuming default items per page
    expect(component.displayedPhotos.length).toBeGreaterThan(0);
  });

  it('should update displayedPhotos when goToPage is called', () => {
    const mockPhotos = [
      {
        albumId: 1,
        id: 1,
        title: 'Photo 1',
        url: 'url1',
        thumbnailUrl: 'url1',
      },
      {
        albumId: 2,
        id: 2,
        title: 'Photo 2',
        url: 'url2',
        thumbnailUrl: 'url2',
      },
      {
        albumId: 3,
        id: 3,
        title: 'Photo 3',
        url: 'url3',
        thumbnailUrl: 'url3',
      },
      {
        albumId: 4,
        id: 4,
        title: 'Photo 4',
        url: 'url4',
        thumbnailUrl: 'url4',
      },
    ];

    component.photos = mockPhotos;
    component.totalItems = mockPhotos.length;
    component.currentPage = 1;
    component.itemsPerPage = 2;

    component.goToPage(2);

    expect(component.currentPage).toEqual(2);
    expect(component.displayedPhotos.length).toBeGreaterThan(0);
  });

  it('should calculate totalPages correctly', () => {
    const mockPhotos = [
      {
        albumId: 1,
        id: 1,
        title: 'Photo 1',
        url: 'url1',
        thumbnailUrl: 'url1',
      },
      {
        albumId: 2,
        id: 2,
        title: 'Photo 2',
        url: 'url2',
        thumbnailUrl: 'url2',
      },
    ];

    component.photos = mockPhotos;
    component.totalItems = mockPhotos.length;
    component.itemsPerPage = 15;

    expect(component.totalPages).toEqual(
      Math.ceil(mockPhotos.length / component.itemsPerPage)
    );
  });
});
