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
import {Container} from "./container/Container";
import {proxy} from "./utility/Proxy";
import {Scene} from "./scene/Scene";
import {SceneTransition} from "./scene/SceneTransition";

/**
 * Default Tick Rate
 *
 * Provides a constant which declares the standard framework tick rate to third party components. For the purposes of
 * this framework, the tick rate is measured by iterations per second in which both the entity updates and frame
 * rendering is processed by the library.
 *
 * @type {number} a tick rate (iterations per second).
 */
export const DEFAULT_TICK_RATE : number = 40;

/**
 * Firefly
 *
 * Provides a core entry point to the firefly Canvas framework which provides basic management capabilities for entities
 * within 2D space with custom functionality which can easily be leveraged for the purpose of creating games or pretty
 * animations.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class Firefly {
        private _tickRate : number = 40;
        private _container : Container = null;

        private _state : boolean = false;
        private _paused : boolean = false;
        private _lastUpdate : number = 0;
        private _timeoutId : number = null;

        private _scene : Scene = null;
        private _targetScene : Scene = null;
        private _transition : SceneTransition = null;

        /**
         * Constructs a new framework instance within a specified container.
         */
        constructor(container : Container) {
                this._container = container;
        }

        /**
         * Renders a single application frame.
         * @param delta a number which describes the relation between frames and realworld seconds.
         */
        protected render(delta : number) : void {
                this._container.clear();

                if (this._scene != null) {
                        if (this._transition) {
                                if (this._transition.draw(this._container, delta, this._scene, this._targetScene)) {
                                        this._scene = this._targetScene;
                                        this._targetScene = this._transition = null;
                                }
                        } else {
                                this._container.drawIsolated(this._scene, delta);
                        }
                }

                if (!this._container.rootScope) {
                        console.error('Left over scopes detected. Did you call Container#pop()?');

                        while (!this._container.rootScope) {
                                this._container.pop();
                        }
                }
        }

        /**
         * Starts the framework's render and processing cycle based on the tick rate currently configured.
         *
         * Note: This method can only be called once and will return an error if the framework is already running. This
         * state will be reset when {@link #stop()} is called.
         */
        public start() : void {
                if (this._state) {
                        throw new Error("Already in running state.");
                }

                this._state = true;
                this.update();
        }

        /**
         * Stops the framework's render and processing cycle.
         *
         * Note: This method can only be called after the framework has been started using {@link #start()} and will
         * return an error if the framework is already stopped.
         */
        public stop() : void {
                if (!this._state) {
                        throw new Error("Already stopped.");
                }

                this._state = false;
                window.clearTimeout(this._timeoutId);
        }

        /**
         * Commences a single update.
         * @param delta a number which describes the relation between updates and realworld seconds.
         */
        protected think(delta : number) : void {
                this._scene.think(this._container, delta);
        }

        /**
         * Triggers a single application update which will update the entire entity state and re-render the current
         * scene.
         */
        public update() : void {
                const delta : number = (this._lastUpdate == 0 ? 1.0 : ((new Date()).getTime() - this._lastUpdate) / 1000);

                if (!this._paused) {
                        this.think(delta);
                }
                this.render(delta);

                this._lastUpdate = (new Date()).getTime();

                if (this._state) {
                        const expectedTickTime = 1 / this._tickRate;
                        const loss = delta - expectedTickTime;

                        if (loss > 0 && (loss - expectedTickTime) >= 0.001) {
                                console.log('Cannot keep up! Lost ' + loss + 's which exceeds expected distance of ' + expectedTickTime + 's between ticks.');

                                this._lastUpdate -= (loss - expectedTickTime);
                                this.update();
                        } else {
                                window.setTimeout(proxy(this.update, this), (expectedTickTime - loss) * 1000);
                        }
                }
        }

        /**
         * Switches the current scene.
         *
         * @param scene a scene.
         * @param transition a transition.
         */
        public switchScene(scene : Scene, transition : SceneTransition = null) : void {
                if (transition == null) {
                        this._scene = scene;
                } else {
                        this._targetScene = scene;
                        this._transition = transition;
                }
        }

        /* == Getters & Setters == */

        /**
         * Retrieves the container this framework instance is currently tied to.
         *
         * @returns {Container} a reference to the active container implementation.
         */
        get container() : Container {
                return this._container;
        }

        /**
         * Retrieves the currently active application scene.
         *
         * @returns {Scene} a scene.
         */
        get scene() : Scene {
                return this._scene;
        }

        /**
         * Retrieves the current framework pause state.
         *
         * When paused, the framework will keep rendering and thus updating all entities and scenes, but it will not
         * call any of the local update methods and thus its state will not advance.
         *
         * @returns {boolean} true if paused, false otherwise.
         */
        get paused() : boolean {
                return this._paused;
        }

        /**
         * Sets the current framework pause state.
         *
         * Note: A framework instance cannot switch into/out of pause mode when it is not running. This value is reset
         * when {@link #stop()} is called.
         *
         * @param value if true pauses processing, otherwise un-pauses.
         */
        set paused(value : boolean) {
                if (!this._state) {
                        throw new Error("Already stopped. Cannot pause.");
                }

                this._paused = value;
        }

        /**
         * Retrieves the current framework state (as in running or not running).
         *
         * @returns {boolean} true if running, false otherwise.
         */
        get running() : boolean {
                return this._state;
        }

        /**
         * Retrieves the current framework tick rate (in iterations per second).
         *
         * @returns {number} a tick rate (in iterations per second).
         *
         * @see DEFAULT_TICK_RATE for more information on the tick rate system.
         */
        get tickRate() : number {
                return this._tickRate;
        }

        /**
         * Updates the current framework tick rate (in iterations per second).
         *
         * Note: This value cannot be changed while the framework is still active and thus the update process has to be
         * stopped using {@link #stop()} before attempting to change this value.
         *
         * @param value a tick rate (in iterations per second).
         */
        set tickRate(value : number) {
                if (this._state) {
                        throw new Error("Cannot change tick rate without stopping the framework.");
                }

                this._tickRate = value;
        }
}
