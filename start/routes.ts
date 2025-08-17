// start/routes.ts
import router from '@adonisjs/core/services/router'
import KolbController from '../app/controllers/kolb_controller.js'

router.get('/health', async () => ({ status: 'ok' }))
// Importa el controlador de Kolb

// Instancia del controlador (usa arrow functions en el controller, así que no pierde el this)
const c = new KolbController()

// -------------------- Catálogos --------------------
router.get('/kolb/estilos', c.estilos)
router.get('/kolb/preguntas', c.preguntas)
router.get('/kolb/preguntas-bloques', c.preguntasBloques)

// -------------------- Estudiantes --------------------
router.post('/kolb/estudiantes', c.crearEstudiante)
router.get('/kolb/estudiantes', c.estudiantes)
router.get('/kolb/estudiantes/:id_estudiante', c.estudiante)

// -------------------- Test --------------------
router.post('/kolb/responder', c.responderYCalcular)

// -------------------- Resultados --------------------
router.get('/kolb/resultados/:id_estudiante', c.resultado)

// (Opcional) pequeña ruta de ping para probar que el server responde
router.get('/', async () => ({ ok: true }))
