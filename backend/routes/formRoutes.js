import express from 'express'
import { formData } from '../controllers/formController.js';
const router = express.Router();

router.post('/form', formData);

export default router;