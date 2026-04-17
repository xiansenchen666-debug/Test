import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    
    if (!username || !password) {
      res.status(400).json({ code: 400, message: 'Username and password are required', data: {} });
      return;
    }

    try {
      const token = await this.authService.login(username, password);
      if (token) {
        res.status(200).json({ code: 200, message: 'Success', data: { token } });
      } else {
        res.status(401).json({ code: 401, message: 'Invalid credentials', data: {} });
      }
    } catch (error) {
      throw error;
    }
  }
}
