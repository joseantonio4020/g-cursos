import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EstudianteService } from '../../services/estudiante.service';
import { CursoService } from '../../services/curso.service';
import { Estudiante } from '../../models/estudiante';
import { Curso } from '../../models/curso';
import { LoadingComponent } from '../../components/loading/loading.component';
