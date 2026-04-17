import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'fallback-secret-for-dev';

  async login(username: string, password: string): Promise<string | null> {
    // Mock user for demonstration. In a real app, query from Repository.
    const mockHash = await bcrypt.hash('admin123', 10);
    
    if (username === 'admin' && await bcrypt.compare(password, mockHash)) {
      const token = jwt.sign({ id: 1, role: 'admin' }, this.jwtSecret, { expiresIn: '1h' });
      return token;
    }
    
    return null;
  }
}
