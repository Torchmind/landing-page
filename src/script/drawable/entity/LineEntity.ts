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
import {Vector2} from "../Vector2";
import {VelocityEntity} from "./VelocityEntity";
import {SceneManager} from "../../scene/SceneManager";

/**
 * Line
 *
 * Represents a simple line within a canvas.
 */
export class LineEntity extends VelocityEntity {
        private manager : SceneManager;
        private size : number;

        constructor(manager : SceneManager) {
                super(Vector2.RANDOM.multiplyVector(manager.bounds), (Math.random() * 720), Vector2.RANDOM.multiply(0.5), ((Math.random() * 800) + 400));

                this.manager = manager;
                this.size = Math.max(0.25, Math.random());
        }

        /**
         * {@inheritDoc}
         */
        public think() : void {
                super.think();

                if (this.position.x <= -100 || this.position.x >= (this.manager.bounds.x + 100) || this.position.y <= -100 || this.position.y >= (this.manager.bounds.y + 100)) {
                        this.health = 0;
                }
        }

        /**
         * {@inheritDoc}
         */
        public draw(ctx : CanvasRenderingContext2D) : void {
                const position1 = (new Vector2(0, (80 * this.size))).rotate(this.rotation).offset(this.position);
                const position2 = (new Vector2((-100 * this.size), 0)).rotate(this.rotation).offset(this.position);
                const position3 = (new Vector2((80 * this.size), 0)).rotate(this.rotation).offset(this.position);

                ctx.beginPath();
                {
                        ctx.moveTo(position1.x, position1.y);
                        ctx.lineTo(position2.x, position2.y);
                }
                ctx.stroke();
                ctx.beginPath();
                {
                        ctx.moveTo(position2.x, position2.y);
                        ctx.lineTo(position3.x, position3.y);
                }
                ctx.stroke();
                ctx.beginPath();
                {
                        ctx.moveTo(position3.x, position3.y);
                        ctx.lineTo(position1.x, position1.y);
                }
                ctx.stroke();
        }

        public isDead() : boolean {
                return super.isDead() || (this.position.x <= -100 || this.position.x >= (this.manager.bounds.x + 100) || this.position.y <= -100 || this.position.y >= (this.manager.bounds.y + 100));
        }

        /**
         * {@inheritDoc}
         */
        public getVisibility() : number {
                if (this.lifetime < 100) {
                        return this.lifetime / 100;
                }

                return (this.health >= 100 ? 1.0 : this.health / 100);
        }
}
