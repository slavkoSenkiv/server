import { Router, Request, Response, NextFunction} from 'express';

interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined }
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.loggedIn) {
     next();
     return;
  }
  res.status(403);
  res.send(`
    <div>
      <div> Not Permitted! </div>
      <div> You are NOT logged in </div>
      <a href="/login">Login</a>
    </div>
  `);
}

const router = Router();

router.get('/login', (req: Request, res: Response) => {
  res.send(`
    <form method="POST">

      <div>
        <label>Email</label>
        <input name="email">
      </div>

      <div>
        <label>Password</label>
        <input name="password" type="password">
      </div>

      <button>Submit</button>

    </form>
  `);
});

router.post('/login', (req: RequestWithBody, res: Response) => {
  let { email, password } = req.body;
  if (email && password && email === 'hi@hi.hi' && password === 'pass') {
    req.session = { loggedIn: true }; 
    res.redirect('/');
  } else {
    res.send('invalid email or password');
  }
});

router.get('/', (req: Request, res: Response) => {
  if (req.session && req.session.loggedIn) {
    res.send(`
      <div>
        <div> You are logged in </div>
        <a href="/protected">Protected content</a></br>
        <a href="/logout">Logout</a>
      </div>
    `);
  } else {
    res.send(`
      <div>
        <div> You are NOT logged in </div>
        <a href="/login">Login</a>
      </div>
    `);
  }
});

router.get('/logout', (req: Request, res: Response) => {
  req.session = undefined;
  res.redirect('/');
});

router.get('/protected', requireAuth, (req: Request, res: Response) => {
  res.send(`
    <div>
      <div>Welcome to protected route, logged in user! </div>
      <a href="/logout">Logout</a>
    </div>
`)});

export { router };