import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { io } from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Url } from 'url';

const SOCKET_ENDPOINT = 'localhost:3000';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    room: any;
    rooms: any;
    roomName: any;
    latitude: any;
    longitude: any;
    // rooms: { room: string, user1: string, user2: string }[] = [];
    selectedRoom: any;
    messageArray: { user: string, message: any, locationMessage: Url, createdAt: any }[] = [];
    messageText: string;    //conatins input string
    socket;

    isOpen: boolean;
    isLocation: boolean

    constructor(private route: ActivatedRoute, private authService: AuthService,
        private cookieService: CookieService, private http: HttpClient) { }
    user = this.authService.id;
    AUTH_API = "http://localhost:3000/";
    ngOnInit() {
        // this.room = this.route.snapshot.paramMap.get('name');
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            'withCredentials': 'true',
            'observe': 'response',
            'Token': this.cookieService.get('Token')
        });
        let options = { headers: headers };
        console.log('21');
        this.http.get(this.AUTH_API + 'rooms',
            options
            //   httpOptions
        ).subscribe(data => {
            console.log('26', data)
            // data.forEach(element => {
            //     this.rooms.push(element);
            // });
            this.rooms = data;
            console.log('25')
        }, error => {
            console.log('29', error)

        })
        this.setupSocketConnection()

        this.showChatHistory()
        this.printMessages()

    }

    showChatHistory() {
        this.messageArray = []

        this.socket.on('chat-history', (chat) => {
            chat.forEach(element => {
                this.messageArray.push({ user: element.username, message: element.msg, locationMessage: null, createdAt: element.createdAt })
            });
            console.log('37 list comp.ts', chat);

        })
    }

    printMessages() {
        console.log('31');
        //'sdtring'
        this.socket.on('message', (currMessage) => {
            console.log('34', currMessage);

            if (currMessage.locationMsg) {
                this.isLocation = true
            }
            else {
                this.isLocation = false;
            }
            // else {
            this.messageArray.push({
                message: currMessage.msg,
                user: currMessage.username,
                locationMessage: currMessage.locationMsg,
                createdAt: currMessage.createdAt
            })
            // }

            console.log('33', this.messageArray);

        })
    }

    setupSocketConnection() {
        this.socket = io(SOCKET_ENDPOINT)

        //show messages

        //show users list
        // this.socket.on('showExistingRooms', (rooms) => {
        //     console.log('30 Rooms Received');
        //     this.rooms = rooms;
        // })

    }

    //Open room
    selectUserHandler(room) {
        console.log('101', room);
        this.isOpen = true; //opens input body
        this.room = room.user2;
        this.roomName = room.room
        var i = 1;
        this.selectedRoom = this.rooms.find((currRoom) => {
            console.log(i++);
            return currRoom.room == room.room
        })

        this.messageArray = [];
        console.log('46 joining in the room', room);

        this.socket.emit('join', { username: this.user, room: room.room }, (e) => {
            if (e) {
                console.log('50', e)
            }
            console.log('join emit completed');
        })
    }

    sendMessage() {
        const messageToSend = this.messageText
        this.messageText = ''
        // console.log('message to send is', messageToSend);
        this.socket.emit('sendMessage', ({ username: this.user, messageToSend, room: this.roomName }), (e) => {
            console.log('63 emitted msg:', messageToSend);
            console.log('room: ', this.room);
        })
    }


    sendLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {

                const locationObject = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
                // this.latitude = position.coords.latikstude;
                // this.longitude = position.coords.longitude;
                //   this.zoom = 16;
                console.log(" 143 position", locationObject)

                this.socket.emit('sendLocation', { username: this.user, locationToSend: locationObject, room: this.roomName }, () => {
                    console.log('Location Shared!');
                    // $sendLocationButton.removeAttribute('disabled')
                })
            });
        } else {
            console.log("User not allowed")
        }
    }
}