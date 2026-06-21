import { TestBed } from '@angular/core/testing';
import { ModalController, ToastController } from '@ionic/angular';

import { ToastService } from './toast-EN.service';
import { UtilsService } from './utils.service';

describe('ToastService', () => {
  let service: ToastService;
  const toastControllerSpy = jasmine.createSpyObj('ToastController', [
    'create',
  ]);
  const utilsServiceSpy: any = {};
  const modalControllerSpy = jasmine.createSpyObj('ModalController', [
    'dismiss',
    'create',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: ToastController, useValue: toastControllerSpy },
      ],
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('toast positioning based on device type', () => {
    let toastController: jasmine.SpyObj<ToastController>;
    let mockToast: jasmine.SpyObj<HTMLIonToastElement>;

    beforeEach(() => {
      Object.defineProperty(utilsServiceSpy, 'isSmallDevice', {
        get: () => false,
        configurable: true,
      });

      toastController = TestBed.inject(
        ToastController
      ) as jasmine.SpyObj<ToastController>;

      // Basic toast mock
      mockToast = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
      mockToast.present.and.returnValue(Promise.resolve());
      toastController.create.and.returnValue(Promise.resolve(mockToast));
    });

    it('should show toast at bottom on big devices', () => {
      spyOnProperty(utilsServiceSpy, 'isSmallDevice', 'get').and.returnValue(false);
      
      service.showToast('Test Message');
      
      expect(toastController.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          position: 'bottom',
        })
      );
    });

    it('should show toast at top on small devices', () => {
      spyOnProperty(utilsServiceSpy, 'isSmallDevice', 'get').and.returnValue(true);
      
      service.showToast('Test Message');
      
      expect(toastController.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          position: 'top',
        })
      );
    });
  });

  describe('showToast method', () => {
    let toastController: jasmine.SpyObj<ToastController>;
    let mockToast: jasmine.SpyObj<HTMLIonToastElement>;

    beforeEach(() => {
      toastController = TestBed.inject(
        ToastController
      ) as jasmine.SpyObj<ToastController>;

      // Basic toast mock
      mockToast = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
      mockToast.present.and.returnValue(Promise.resolve());
      toastController.create.and.returnValue(Promise.resolve(mockToast));
    });

    it('should show toast', () => {
      // Arrange
      const message = 'Test Message';
      const duration = 3000;
      // Act
      service.showToast(message);
      // Assert
      expect(toastController.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          message,
          duration,
        })
      );
    });

    it('should handle error when toast presentation fails', async () => {
      // Arrange
      const message = 'Test Message';
      spyOn<any>(service, 'showToastMessage').and.returnValue(Promise.reject(new Error('Toast creation failed')));
      const consoleErrorSpy = spyOn(console, 'error');
      // Act
      service.showToast(message);
      await Promise.resolve();
      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error presenting toast:', new Error('Toast creation failed'));
    });
  });

});
