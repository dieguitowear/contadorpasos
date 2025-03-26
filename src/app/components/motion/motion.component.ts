import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionService } from './Services/motion.service';
import { MotionData } from './Model/MotionData.model';

@Component({
  selector: 'app-motion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './motion.component.html',
  styleUrls: ['./motion.component.scss'] 
})
export class MotionComponent implements OnInit, OnDestroy {
  
  constructor(private motionS: MotionService) {}

  motionData: MotionData = {};

  ngOnInit(): void {
    this.motionS.startMotionDetection((data: MotionData) => {
      this.motionData = data;
      console.log('Motion Data:', this.motionData);
    });
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection();
  }

  // Método para reiniciar el contador de pasos
  resetStepCount() {
    this.motionS.resetStepCount();
  }
}