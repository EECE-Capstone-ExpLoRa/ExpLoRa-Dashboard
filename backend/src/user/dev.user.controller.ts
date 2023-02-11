import { Controller, Get, NotFoundException, Param, ParseIntPipe } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiCreatedResponse, ApiNotFoundResponse } from "@nestjs/swagger";
import { UserDto } from "./user.dto";
import { UserService } from "./user.service";

@Controller('dev')
export class DevUserController {
    constructor(private readonly userService: UserService) {}
    
    @Get('username/:username')
    @ApiOperation({summary: "Test endpoint for getting users by username"})
    @ApiParam({name: "username", description: "The user's username"})
    @ApiCreatedResponse({description: "The Queried user", type: UserDto})
    @ApiNotFoundResponse({description: "User with the given username not found"})
    public async findUserByUsername(@Param('username') username: string): Promise<UserDto> {
      const user = await this.userService.findUserByUsername(username);
      if (!user) {
        throw new NotFoundException(`User with the username: ${username} not found`);
      }
      return user;
    }

    @Get(':id')
    @ApiOperation({summary: "Test enpoint for getting users by id"})
    @ApiNotFoundResponse({description: "User with the given Id not found"})
    @ApiParam({name: "id", description: "The user's Id"})
    @ApiCreatedResponse({description: "The Queried user", type: UserDto})
    public async findUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
      const user = await this.userService.findUserById(id);
      if (!user) {
        throw new NotFoundException(`The user with the id: ${id} does not exist`);
      }
      return user;
    }

    @Get()
    @ApiOperation({summary: "Test endpoint for getting all users"})
    @ApiCreatedResponse({description: "List of Users", type: UserDto, isArray: true})
    public async findAllUsers(): Promise<UserDto[]> {
      return this.userService.findAllUsers();
    }
}