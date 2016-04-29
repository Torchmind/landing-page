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
import {VelocityEntity} from "../../firefly/entity/VelocityEntity";
import {Container} from "../../firefly/container/Container";
import {Sprite} from "../../firefly/drawable/Sprite";
import {Vector2, Point} from "../../firefly/space/Position";
import {EntityScene} from "../../firefly/scene/EntityScene";
import {BulletEntity} from "./BulletEntity";
import {Collision} from "../../firefly/space/Collision";
import {Entity} from "../../firefly/entity/Entity";
import {AsteroidEntity} from "./AsteroidEntity";

const ROTATION_ACCELERATION = 40;
const ROTATION_DRAG = 20;
const ROTATION_MAX = 80;

const MOVEMENT_ACCELERATION = new Vector2(0, 20);
const MOVEMENT_DRAG = 20;
const MOVEMENT_MAX = 200;

const BULLET_VELOCITY = new Vector2(0, -256);
const SHOOT_DELAY = 0.125;

/**
 * Asteroids Scene
 *
 * Provides an accurate replica of the game Asteroids.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class PlayerEntity extends VelocityEntity {
        private _sprite : Sprite;

        private _acceleration : number = 0;
        private _rotationAcceleration : number = 0;
        private _rotationVelocity : number = 0;
        private _shootTimer : number = SHOOT_DELAY;
        public dead : boolean = false;
        private _lifetime : number = 0;

        constructor(sprite : Sprite) {
                super();
                this._sprite = sprite;
                this.collision = new Collision(this, 25, new Point(0, 0));
        }

        /**
         * {@inheritDoc}
         */
        public draw(container : Container, delta : number) : void {
                super.draw(container, delta);

                if (this._lifetime <= 5) {
                        const portion : number = this._lifetime % 1;
                        container.fillColor.alpha *= Math.abs(0.5 - portion);
                }

                this._sprite.draw(0.35);
        }

        /**
         * {@inheritDoc}
         */
        public isDead() : boolean {
                return this.dead;
        }

        /**
         * {@inheritDoc}
         */
        public think(container : Container, delta : number) : void {
                this._shootTimer += delta;
                this._lifetime += delta;

                // controller input
                if (Math.abs(this._rotationVelocity) < ROTATION_MAX) {
                        this._rotationVelocity += ROTATION_ACCELERATION * this._rotationAcceleration;
                }

                if (Math.abs(this.velocity.length) < MOVEMENT_MAX) {
                        this.velocity.offsetBy(MOVEMENT_ACCELERATION.clone().rotate(this.rotation).multiplyByFactor(this._acceleration));
                }

                // drag
                if (this._rotationAcceleration == 0) {
                        const drag : number = ROTATION_DRAG * delta;

                        if (Math.abs(this._rotationVelocity) <= drag) {
                                this._rotationVelocity = 0;
                        } else {
                                this._rotationVelocity -= (this._rotationVelocity < 0 ? drag * -1 : drag);
                        }
                }

                if (this._acceleration == 0) {
                        const drag : number = MOVEMENT_DRAG * delta;

                        if (Math.abs(this.velocity.x) <= drag) {
                                this.velocity.x = 0;
                        } else {
                                this.velocity.x -= (this.velocity.x < 0 ? drag * -1 : drag);
                        }

                        if (Math.abs(this.velocity.y) <= drag) {
                                this.velocity.y = 0;
                        } else {
                                this.velocity.y -= (this.velocity.y < 0 ? drag * -1 : drag);
                        }
                }

                // rotation/movement
                this.rotation += this._rotationVelocity * delta;

                // update position
                super.think(container, delta);

                if (this.position.x < -40) {
                        this.position.x = container.bounds.width + 40;
                } else if (this.position.x > container.bounds.width + 40) {
                        this.position.x = -40;
                }

                if (this.position.y < -40) {
                        this.position.y = container.bounds.height + 40;
                } else if (this.position.y > container.bounds.height + 40) {
                        this.position.y = -40;
                }
        }

        /**
         * {@inheritDoc}
         */
        public onCollide(entity : Entity) : void {
                super.onCollide(entity);

                if (this._lifetime <= 5) {
                        return;
                }

                if (entity instanceof AsteroidEntity) {
                        this.dead = true;
                        this._lifetime = 0;
                }
        }

        /**
         * Shoots a bullet.
         *
         * @param scene a scene.
         * @returns {boolean} true if a bullet was shot, false otherwise.
         */
        public shoot(scene : EntityScene) : boolean {
                if (this._shootTimer < SHOOT_DELAY) {
                        return false;
                }

                const entity : BulletEntity = new BulletEntity();
                entity.position = this.position.clone().offsetBy((new Vector2(0, -40)).rotate(this.rotation));
                entity.rotation = this.rotation;
                entity.velocity = BULLET_VELOCITY.clone().rotate(this.rotation);
                scene.spawn(entity);

                this._shootTimer = 0.0;
                return true;
        }

        /* == Getters & Setters == */

        /**
         * Updates the acceleration value (1 being backward and -1 being forward acceleration).
         *
         * @param value an acceleration.
         */
        set acceleration(value : number) {
                value = Math.min(1, Math.max(-1, Math.floor(value)));
                this._acceleration = value;
        }

        /**
         * Updates the rotation acceleration value (1 being clockwise and -1 being counter-clockwise).
         *
         * @param value an acceleration.
         */
        set rotationAcceleration(value : number) {
                value = Math.min(1, Math.max(-1, Math.floor(value)));
                this._rotationAcceleration = value;
        }
}
