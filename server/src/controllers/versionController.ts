import { Route, Get, Query, Body, Tags, Security } from 'tsoa';


@Route('version')
export class VersionController {

    @Get()
    public async version(){
        return {
            version:"0.0.1"
        }
    }
}