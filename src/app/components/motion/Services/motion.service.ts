import { Injectable } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';
import { MotionData } from '../Model/MotionData.model';

@Injectable({
  providedIn: 'root'
})
export class MotionService {
  private accelListener?: PluginListenerHandle;
  private gyroListener?: PluginListenerHandle;

  // Variables para detección de pasos
  private stepThreshold = 10; // Umbral de aceleración para detectar un paso
  private lastAcceleration = { x: 0, y: 0, z: 0 };
  private stepCount = 0;
  private lastStepTime = 0;

  constructor() { }

  async startMotionDetection(callback: (data: MotionData) => void) {
    const motionData: MotionData = {};

    this.accelListener = await Motion.addListener('accel', (event) => {
      motionData.acceleration = event.acceleration;
      
      // Lógica de detección de pasos
      this.detectSteps(event.acceleration);
      motionData.stepCount = this.stepCount;
      
      callback(motionData);
    });

    this.gyroListener = await Motion.addListener('orientation', (event) => {
      motionData.rotation = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma
      };
      callback(motionData);
    });
  }

  private detectSteps(acceleration: { x: number, y: number, z: number }) {
    const currentTime = Date.now();
    
    // Calcular la diferencia de aceleración
    const deltaX = Math.abs(acceleration.x - this.lastAcceleration.x);
    const deltaY = Math.abs(acceleration.y - this.lastAcceleration.y);
    const deltaZ = Math.abs(acceleration.z - this.lastAcceleration.z);

    // Calcular la magnitud del cambio
    const magnitudeDelta = Math.sqrt(deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ);

    // Condiciones para detectar un paso
    const isSignificantMovement = magnitudeDelta > this.stepThreshold;
    const isNotTooFrequent = (currentTime - this.lastStepTime) > 300; // No más de un paso cada 300ms

    if (isSignificantMovement && isNotTooFrequent) {
      this.stepCount++;
      this.lastStepTime = currentTime;
    }

    // Actualizar la última aceleración
    this.lastAcceleration = acceleration;
  }

  async stopMotionDetection() {
    if (this.accelListener) {
      await this.accelListener.remove();
    }
    if (this.gyroListener) {
      await this.gyroListener.remove();
    }
    
    // Resetear contador de pasos
    this.stepCount = 0;
  }

  // Método para reiniciar manualmente el contador de pasos
  resetStepCount() {
    this.stepCount = 0;
  }
}