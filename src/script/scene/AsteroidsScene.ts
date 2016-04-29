/*
 * Copyright 2016 Johannes Donath <johannesd@torchmind.com>
 * and other copyright owners as documented in the project's IP log.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Container} from "../firefly/container/Container";
import {EntityScene} from "../firefly/scene/EntityScene";
import {Sprite} from "../firefly/drawable/Sprite";
import {PlayerEntity} from "./entity/PlayerEntity";
import {Point, Vector2} from "../firefly/space/Position";
import {AsteroidEntity} from "./entity/AsteroidEntity";
import {ControlsEntity} from "./entity/ControlsEntity";
import {Firefly} from "../firefly/Firefly";
import {HighScore, Leaderboard} from "./Highscore";
import {DefaultScene} from "./DefaultScene";
import {FadeTransition} from "../firefly/scene/FadeTransition";
declare const $:any;

const CHARACTER_START : number = 65;
const CHARACTER_END : number = 90;
const CHARACTER_PAUSE : number = 0.25;

/**
 * Asteroids Scene
 *
 * Provides an accurate replica of the game Asteroids.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class AsteroidsScene extends EntityScene {
        private _firefly : Firefly;
        private _sprites : Sprite[] = [];
        private _playerSprite : Sprite;
        private _ufoSprite : Sprite;

        private _playerEntity : PlayerEntity;
        private _lives : number = 4;
        public score : number = 0;

        private _name : string = null;
        private _nameBuffer : string = '';
        private _nameIndex : number = 0;
        private _nameCharacterIndex : number = CHARACTER_START;
        private _namePauseTimer : number = 0;
        private _scorePushed : boolean = false;
        private _retrySelected : boolean = true;
        private _leaderboard : Leaderboard = new Leaderboard();

        public constructor(firefly : Firefly) {
                super();
                this._firefly = firefly;

                this._firefly.container.createSprite('assets/image/asteroid1.svg').then((s) => {
                        this._sprites.push(s);
                });
                this._firefly.container.createSprite('assets/image/asteroid2.svg').then((s) => {
                        this._sprites.push(s);
                });
                this._firefly.container.createSprite('assets/image/asteroid3.svg').then((s) => {
                        this._sprites.push(s);
                });
                this._firefly.container.createSprite('assets/image/asteroid4.svg').then((s) => {
                        this._sprites.push(s);
                });

                this._firefly.container.createSprite('assets/image/player.svg').then((s) => {
                        this._playerSprite = s;

                        s.pivot = new Point(0.5, 0.5);

                        this._playerEntity = new PlayerEntity(s);
                        this._playerEntity.position = this._firefly.container.center.clone();

                        this.spawn(this._playerEntity);
                });
                this._firefly.container.createSprite('assets/image/ufo.svg').then((s) => {
                        this._ufoSprite = s;
                });

                this._firefly.container.createSprite('assets/image/controls.svg').then((s) => {
                        s.pivot= new Point(0.5, 1);

                        const entity : ControlsEntity = new ControlsEntity(s);

                        entity.position = this._firefly.container.bounds.end;
                        entity.position.x = this._firefly.container.center.x;
                        entity.position.y -= s.bounds.end.y * 0.1;

                        this.spawn(entity);
                });
        }

        /**
         * {@inheritDoc}
         */
        public think(container : Container, delta : number) : void {
                if (this._playerEntity != null) {
                        if (this._firefly.keyboard.isPressed(37)) {
                                this._playerEntity.rotationAcceleration = -1;
                        } else if (this._firefly.keyboard.isPressed(39)) {
                                this._playerEntity.rotationAcceleration = 1;
                        } else {
                                this._playerEntity.rotationAcceleration = 0;
                        }

                        if (this._firefly.keyboard.isPressed(38)) {
                                this._playerEntity.acceleration = -1;
                        } else if (this._firefly.keyboard.isPressed(40)) {
                                this._playerEntity.acceleration = 1;
                        } else {
                                this._playerEntity.acceleration = 0;
                        }

                        if (this._firefly.keyboard.isPressed(32)) {
                                this._playerEntity.shoot(this);
                        }
                }

                if (this._lives == 0) {
                        if (this._name == null) {
                                this._namePauseTimer += delta;

                                if (this._namePauseTimer >= CHARACTER_PAUSE) {
                                        if (this._firefly.keyboard.isPressed(38)) {
                                                ++this._nameCharacterIndex;
                                                this._namePauseTimer = 0;
                                        } else if (this._firefly.keyboard.isPressed(40)) {
                                                --this._nameCharacterIndex;
                                                this._namePauseTimer = 0;
                                        } else if (this._firefly.keyboard.isPressed(32)) {
                                                ++this._nameIndex;
                                                this._namePauseTimer = 0;
                                        } else if (this._firefly.keyboard.isPressed(8)) {
                                                --this._nameIndex;
                                                this._namePauseTimer = 0;
                                        }
                                }

                                if (this._firefly.keyboard.isPressed(13) || this._nameIndex == 10) {
                                        this._name = this._nameBuffer;
                                        this._nameBuffer = '';
                                        this._namePauseTimer = 0;
                                } else {
                                        if (this._nameCharacterIndex > CHARACTER_END) {
                                                this._nameCharacterIndex = CHARACTER_START;
                                        } else if (this._nameCharacterIndex < CHARACTER_START) {
                                                this._nameCharacterIndex = CHARACTER_END;
                                        }

                                        this._nameBuffer = this._nameBuffer.substr(0, this._nameIndex) + String.fromCharCode(this._nameCharacterIndex);
                                }
                        } else if (!this._scorePushed) {
                                this._scorePushed = true;
                                this._leaderboard.pushScore(new HighScore(this._leaderboard, this._name, this.score));
                        } else {
                                this._namePauseTimer += delta;

                                if (this._namePauseTimer >= CHARACTER_PAUSE) {
                                        if (this._firefly.keyboard.isPressed(38) || this._firefly.keyboard.isPressed(40)) {
                                                this._namePauseTimer = 0;
                                                this._retrySelected = !this._retrySelected;
                                        }

                                        if (this._firefly.keyboard.isPressed(13)) {
                                                if (this._retrySelected) {
                                                        this._lives = 4;
                                                        this.score = 0;
                                                        this._scorePushed = false;

                                                        this._entities.splice(0, this._entities.length);
                                                } else {
                                                        $('#main').fadeIn(5000);
                                                        this._firefly.switchScene(new DefaultScene(), new FadeTransition(5));
                                                }
                                        }
                                }
                        }
                }

                super.think(container, delta);

                if (this._sprites.length > 0) {
                        while (this.length < Math.pow((0.000004 * container.bounds.pixels), Math.min(2, (Math.floor(this.score / 1000) + 1)))) {
                                console.log('Spawning Asteroid.');

                                const entity : AsteroidEntity = new AsteroidEntity(this, this._sprites[Math.floor(Math.random() * this._sprites.length)]);
                                const position : Vector2 = Vector2.RANDOM.multiplyBy(container.bounds.end);
                                const velocity : Vector2 = Vector2.RANDOM.multiplyByFactor(80);

                                switch (Math.floor(Math.random() * 3)) {
                                        case 0:
                                                position.y = -50;

                                                if (velocity.y < 0) {
                                                        velocity.y *= -1;
                                                }
                                                break;
                                        case 1:
                                                position.x = container.bounds.width + 50;

                                                if (velocity.x > 0) {
                                                        velocity.y *= -1;
                                                }
                                                break;
                                        case 2:
                                                position.y = container.bounds.height + 50;

                                                if (velocity.y > 0) {
                                                        velocity.y *= -1;
                                                }
                                                break;
                                        case 3:
                                                position.x = -50;

                                                if (velocity.x < 0) {
                                                        velocity.y *= -1;
                                                }
                                                break;
                                }

                                entity.position = position;
                                entity.velocity = velocity;

                                this.spawn(entity);
                        }
                }

                if (this._playerEntity != null && this._playerEntity.isDead()) {
                        if (this._lives != 0 && --this._lives > 0) {
                                this._playerEntity.velocity = Vector2.ZERO.clone();
                                this._playerEntity.position = container.center.clone();
                                this._playerEntity.dead = false;
                                this.spawn(this._playerEntity);
                        } else {
                                // display highscore
                        }
                }
        }

        /**
         * {@inheritDoc}
         */
        public draw(container : Container, delta : number) : void {
                container.strokeColor.red = container.fillColor.red = container.strokeColor.green = container.fillColor.green = container.strokeColor.blue = container.fillColor.blue = 255;
                super.draw(container, delta);

                // lives
                if (this._playerSprite != null) {
                        container.isolate(() => {
                                const start = container.bounds.end.clone().multiplyByFactor(.05);
                                start.x *= .4;

                                container.translate(start);

                                for (var i : number = 0; i < (this._lives - 1); ++i) {
                                        this._playerSprite.draw(0.4);
                                        container.translate(new Vector2(40, 0));
                                }
                        });
                }

                // score
                container.isolate(() => {
                        const start = container.bounds.end.clone();
                        start.y *= 0.05;
                        start.x *= 0.99;

                        container.translate(start);
                        container.drawText('SCORE: ' + this.score, '18px Helvetica', 'right');
                });

                // highscores
                if (this._lives == 0) {
                        if (this._name == null) {
                                container.isolate(() => {
                                        container.translate(container.center.toVector().offsetBy(new Vector2(0, -40)));
                                        container.drawText('> ' + ('          ' + this._nameBuffer).slice(-10), '18px Monospace');
                                });
                        } else if (this._scorePushed) {
                                container.isolate(() => {
                                        container.translate(container.center.toVector().offsetBy(new Vector2(0, -140)));

                                        container.drawText('Retry?', '28px Monospace');
                                        container.translate(new Vector2(0, 40));

                                        container.drawText((this._retrySelected ? '> ' : '  ') + 'Yes', '18px Monospace');
                                        container.translate(new Vector2(0, 20));

                                        container.drawText((this._retrySelected ? '  ' : '> ') + 'No', '18px Monospace');
                                })
                        }

                        container.isolate(() => {
                                container.translate(container.center.toVector());
                                container.drawIsolated(this._leaderboard, delta);
                        });
                }
        }
}
