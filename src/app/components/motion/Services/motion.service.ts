import { Injectable } from "@angular/core"
import { Motion } from "@capacitor/motion"
import type { PluginListenerHandle } from "@capacitor/core"
import type { MotionData } from "../Model/MotionData.model"

@Injectable({
  providedIn: "root",
})
export class MotionService {
  private accelListener?: PluginListenerHandle
  private gyroListener?: PluginListenerHandle

  // Variables para detección de pasos
  private stepThreshold = 1.8 // Umbral reducido para detectar pasos normales al caminar
  private lastAcceleration = { x: 0, y: 0, z: 0 }
  private stepCount = 0
  private lastStepTime = 0

  constructor() {}

  async startMotionDetection(callback: (data: MotionData) => void) {
    const motionData: MotionData = {}

    this.accelListener = await Motion.addListener("accel", (event) => {
      motionData.acceleration = event.acceleration

      // Lógica de detección de pasos
      this.detectSteps(event.acceleration)
      motionData.stepCount = this.stepCount

      callback(motionData)
    })

    this.gyroListener = await Motion.addListener("orientation", (event) => {
      motionData.rotation = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      }
      callback(motionData)
    })
  }

  private detectSteps(acceleration: { x: number; y: number; z: number }) {
    const currentTime = Date.now()

    // Calcular la magnitud total de la aceleración (incluye la gravedad)
    const totalAcceleration = Math.sqrt(
      acceleration.x * acceleration.x + acceleration.y * acceleration.y + acceleration.z * acceleration.z,
    )

    // Calcular la diferencia con respecto a la última aceleración
    const lastTotalAcceleration = Math.sqrt(
      this.lastAcceleration.x * this.lastAcceleration.x +
        this.lastAcceleration.y * this.lastAcceleration.y +
        this.lastAcceleration.z * this.lastAcceleration.z,
    )

    const accelerationDelta = Math.abs(totalAcceleration - lastTotalAcceleration)

    // Ajustar el tiempo mínimo entre pasos según la cadencia normal al caminar
    const minTimeBetweenSteps = 250 // 250ms entre pasos (aproximadamente 120 pasos por minuto como máximo)
    const isTimeValid = currentTime - this.lastStepTime > minTimeBetweenSteps

    // Detectar un paso cuando hay un cambio significativo en la aceleración
    if (accelerationDelta > this.stepThreshold && isTimeValid) {
      this.stepCount++
      this.lastStepTime = currentTime
      console.log("Paso detectado! Delta:", accelerationDelta.toFixed(2))
    }

    // Actualizar la última aceleración
    this.lastAcceleration = { ...acceleration }
  }

  async stopMotionDetection() {
    if (this.accelListener) {
      await this.accelListener.remove()
    }
    if (this.gyroListener) {
      await this.gyroListener.remove()
    }

    // Resetear contador de pasos
    this.stepCount = 0
  }

  // Método para reiniciar manualmente el contador de pasos
  resetStepCount() {
    this.stepCount = 0
  }

  calibrateStepThreshold(newThreshold: number) {
    this.stepThreshold = newThreshold
    console.log("Umbral de detección de pasos calibrado a:", newThreshold)
  }
}

