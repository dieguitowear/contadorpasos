import { Component, OnInit, OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MotionService } from "./Services/motion.service"
import { MotionData } from "./Model/MotionData.model"

@Component({
  selector: "app-motion",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./motion.component.html",
  styleUrls: ["./motion.component.scss"],
})
export class MotionComponent implements OnInit, OnDestroy {
  constructor(private motionS: MotionService) {}

  motionData: MotionData = {}
  threshold = 1.8 // Valor inicial de sensibilidad

  ngOnInit(): void {
    this.motionS.startMotionDetection((data: MotionData) => {
      this.motionData = data
      console.log("Motion Data:", this.motionData)
    })
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection()
  }

  // Método para reiniciar el contador de pasos
  resetStepCount() {
    this.motionS.resetStepCount()
  }

  updateThreshold() {
    this.motionS.calibrateStepThreshold(this.threshold)
  }
}

