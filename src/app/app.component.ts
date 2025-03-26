import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MotionComponent } from './components/motion/motion.component';

@Component({
  selector: 'app-root',
  standalone: true, // Asegúrate de que sea standalone
  imports: [RouterOutlet, MotionComponent], // Añade MotionComponent aquí
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';
}
