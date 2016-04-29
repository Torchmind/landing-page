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
import {Sprite} from "../../firefly/drawable/Sprite";
import {VelocityEntity} from "../../firefly/entity/VelocityEntity";
import {Container} from "../../firefly/container/Container";
import {Collision} from "../../firefly/space/Collision";
import {Entity} from "../../firefly/entity/Entity";
import {BulletEntity} from "./BulletEntity";
import {Point, Vector2} from "../../firefly/space/Position";
import {EntityScene} from "../../firefly/scene/EntityScene";
import {AsteroidsScene} from "../AsteroidsScene";

/**
 * Asteroids Scene
 *
 * Provides an accurate replica of the game Asteroids.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class AsteroidEntity extends VelocityEntity {
        private _scene : AsteroidsScene;
        private _sprite : Sprite;
        private _scale : number;
        private _dead : boolean = false;

        public constructor(scene : AsteroidsScene, sprite : Sprite, scale : number = Math.max(0.25, Math.random())) {
                super();

                this._scale = scale;
                this._scene = scene;
                this.rotation = Math.random() * 360;
                this._sprite = sprite;
                this.collision = new Collision(this, (this._scale * 100), new Point(0, 0));
        }

        /**
         * {@inheritDoc}
         */
        public draw(container : Container, delta : number) : void {
                super.draw(container, delta);
                this._sprite.draw(this._scale);
        }

        /**
         * {@inheritDoc}
         */
        public isDead() : boolean {
                return this._dead;
        }

        /**
         * {@inheritDoc}
         */
        public onCollide(entity : Entity) : void {
                super.onCollide(entity);

                if (entity instanceof BulletEntity) {
                        console.log('Hit!');
                        this._dead = true;

                        (<BulletEntity> entity).dead = true;

                        this._scene.score += Math.floor(this._scale * 500);

                        if (this._scale >= 0.5) {
                                for (var i : number = 0; i < Math.floor(this._scale * 4); ++i) {
                                        const split : AsteroidEntity = new AsteroidEntity(this._scene, this._sprite, this._scale / 2);
                                        split.position = this.position.clone();
                                        split.velocity = Vector2.RANDOM.multiplyByFactor(50).offsetBy(new Vector2(-25, -25));
                                        this._scene.spawn(split);
                                }
                        }
                }
        }

        /**
         * {@inheritDoc}
         */
        public think(container : Container, delta : number) : void {
                super.think(container, delta);

                if (this.position.x <= -80 || this.position.x >= container.bounds.width + 80 || this.position.y <= -80 || this.position.y >= container.bounds.height + 80) {
                        this._dead = true;
                }
        }
}
