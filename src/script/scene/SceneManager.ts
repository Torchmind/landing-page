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
import $ from "jquery";
import {Scene} from "./Scene";
import {Color} from "../drawable/Color";
import {DefaultScene} from "./DefaultScene";
import {Vector2} from "../drawable/Vector2";

/**
 * Scene Manager
 *
 * Manages the current application state and its scene state.
 * Additionally this type provides a set of utility methods for switching between scenes as needed.
 */
export class SceneManager {
        private _canvas : HTMLCanvasElement;
        private _ctx : CanvasRenderingContext2D;
        private timerId : number;

        private currentScene : Scene;
        private targetScene : Scene;
        private transitionState : number = 0.0;

        public constructor(selector : string) {
                this._canvas = <HTMLCanvasElement> $(selector)[0];

                if (!this._canvas) {
                        throw new Error("Invalid selector '" + selector + "': Could not find element");
                }

                // hook resize
                this.onResize();
                $(window).resize($.proxy(this.onResize, this));

                // hook canvas
                this._ctx = this._canvas.getContext("2d");
                this.currentScene = new DefaultScene(this);
                this._ctx.save();
        }

        protected onResize() : void {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;

                console.log('Synchronized the canvas size with the new window dimensions (' + this._canvas.width + "x" + this._canvas.height + ')');
        }

        public start() : void {
                if (!!this.timerId) {
                        throw new Error("Already started");
                }

                this.timerId = window.setInterval($.proxy(this.onUpdate, this), 50);
        }

        public stop() : void {
                if (!this.timerId) {
                        throw new Error("Already stopped");
                }

                window.clearInterval(this.timerId);
                this.timerId = null;
        }

        /**
         * Handles screen updates.
         */
        private onUpdate() : void {
                this._ctx.restore();

                const color : Color = this.color;
                this._ctx.strokeStyle = color.string;
                this._ctx.fillStyle = color.string;
                this._ctx.save();

                // update scene state
                this.currentScene.think(this);
                this.redraw();
        }

        /**
         * Clears and redraws the entire screen.
         */
        protected redraw() : void {
                this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                this.currentScene.draw(this._ctx);
        }

        get canvas() : HTMLCanvasElement {
                return this._canvas;
        }

        get ctx() : CanvasRenderingContext2D {
                return this._ctx;
        }

        get color() : Color {
                const color : Color = Color.WHITE;

                if (!!this.targetScene) {
                        if (this.transitionState == 1.0) {
                                this.currentScene = this.targetScene;
                                this.targetScene = null;
                        } else {
                                this.transitionState += 0.025;
                                color.alpha = (1.0 - this.transitionState) * 150;
                        }
                }

                return color;
        }

        get bounds() : Vector2 {
                return new Vector2(this.canvas.width, this.canvas.height);
        }
}
