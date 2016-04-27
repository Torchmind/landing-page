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
import {proxy} from "../utility/Proxy";

/**
 * Keyboard
 *
 * Handles the keyboard state.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class Keyboard {
        private _codes = {};

        private _keyDownHandler : (...args : any[]) => any;
        private _keyUpHandler : (...args : any[]) => any;

        public constructor() {
                this._keyDownHandler = proxy(this.onKeyDown, this);
                this._keyUpHandler = proxy(this.onKeyUp, this);
        }

        /**
         * Hooks all relevant keyboard events.
         */
        public hook() : void {
                window.addEventListener('keydown', this._keyDownHandler);
                window.addEventListener('keyup', this._keyUpHandler);
        }

        /**
         * Checks whether a specific key is currently pressed.
         *
         * @param code a key code.
         * @returns {boolean} true if pressed, false otherwise.
         */
        public isPressed(code : number) : boolean {
                return !!this._codes[code];
        }

        /**
         * Handles key presses.
         *
         * @param e a keyboard event.
         */
        private onKeyDown(e : KeyboardEvent) {
                this._codes[e.keyCode] = true;
        }

        /**
         * Handles key releases.
         *
         * @param e a keyboard event.
         */
        private onKeyUp(e : KeyboardEvent) {
                this._codes[e.keyCode] = false;
        }

        /**
         * Shuts down and unhooks all keyboard events.
         */
        public shutdown() : void {
                window.removeEventListener('keydown', this._keyDownHandler);
                window.removeEventListener('keyup', this._keyUpHandler);
        }
}
