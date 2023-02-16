import e from "express";
import { Express } from "express";
import bodyParser from 'body-parser';
import UsersRouter from "./main/components/users/users";
import SettingsRouter from './main/components/settings/settings'
import cors from 'cors';


export default class Server {
  private PORT: string;
  private app: Express;
  private usersRouter: UsersRouter;
  private settingsRouter: SettingsRouter;

  constructor() {
    this.PORT = process.env.PORT || '3000';
    this.app = e();
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.usersRouter = new UsersRouter();
    this.settingsRouter = new SettingsRouter();
  }

  public start() {
    this.app.use('/api/user', this.usersRouter.router);
    this.app.use('/api/settings', this.settingsRouter.router);
    this.app.listen(this.PORT) 
    console.info(`Server is started on port ${this.PORT}`);
  }
}
