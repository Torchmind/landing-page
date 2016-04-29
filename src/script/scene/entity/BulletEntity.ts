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
import {AbstractEntity} from "../../firefly/entity/AbstractEntity";
import {Point} from "../../firefly/space/Position";
import {Collision} from "../../firefly/space/Collision";
import {Entity} from "../../firefly/entity/Entity";
import {PlayerEntity} from "./PlayerEntity";
import {AsteroidEntity} from "./AsteroidEntity";

/**
 * Bullet Entity
 *
 * Provides a simple entity which represents bullets in-game.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class BulletEntity extends VelocityEntity {
        public dead : boolean = false;

        public constructor() {
                super();

                this.collision = new Collision(this, 10, new Point(0, 0));
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
        public draw(container : Container, delta : number) : void {
                super.draw(container, delta);

                container.startPath();
                container.addPoint(new Point(0, 0));
                container.addPoint(new Point(0, 10));
                container.strokePath();
        }

        /**
         * {@inheritDoc}
         */
        public think(container : Container, delta : number) : void {
                super.think(container, delta);

                if (this.position.x < -20 || this.position.x >= container.bounds.width + 20 || this.position.y < -20 || this.position.y >= container.bounds.height + 20) {
                        this.dead = true;
                }
        }
}
