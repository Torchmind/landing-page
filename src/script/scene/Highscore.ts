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
import {Drawable} from "../firefly/drawable/Drawable";
import {Container} from "../firefly/container/Container";
import {Vector2} from "../firefly/space/Position";

/**
 * Leaderboard
 *
 * Manages the local leaderboard.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class Leaderboard implements Drawable {
        private _scores : HighScore[] = [];

        public constructor() {
                if (window.localStorage.getItem('scores') == null) {
                        this.populate();
                        this.save();
                } else {
                        try {
                                const serialized = JSON.parse(window.localStorage.getItem('scores'));

                                for (var obj of serialized) {
                                        this._scores.push(new HighScore(this, obj['name'], obj['score']));
                                }
                        } catch (e) {
                                if (!!console.error) {
                                        console.error('Could not load scores: ' + e);
                                        console.error('Local storage might not be available.');
                                }
                        }
                }
        }

        /**
         * Populates the leaderboard with default values.
         */
        protected populate() : void {
                this.pushScore(new HighScore(this, 'Thorin', 100000));
                this.pushScore(new HighScore(this, 'Fili', 90000));
                this.pushScore(new HighScore(this, 'Kili', 80000));
                this.pushScore(new HighScore(this, 'Balin', 50000));
                this.pushScore(new HighScore(this, 'Dwalin', 40000));
                this.pushScore(new HighScore(this, 'Oin', 20000));
                this.pushScore(new HighScore(this, 'Gloin', 10000));
                this.pushScore(new HighScore(this, 'Dori', 5000));
                this.pushScore(new HighScore(this, 'Nori', 2500));
                this.pushScore(new HighScore(this, 'Ori', 1000));
        }

        /**
         * {@inheritDoc}
         */
        draw(container : Container, delta : number) : void {
                container.drawText('Highscores', '30px Monospace', 'center');
                container.translate(new Vector2(0, 40));

                for (var i : number = 0; i < 10; ++i) {
                        const score : HighScore = this.getScore(i);

                        if (score == null) {
                                break;
                        }

                        container.drawIsolated(score, delta);
                        container.translate(new Vector2(0, 20));
                }
        }

        /**
         * Receives a score at a specific index.
         *
         * @param index
         * @returns {HighScore}
         */
        public getScore(index : number) : HighScore {
                if (index >= this._scores.length) {
                        return null;
                }

                return this._scores[index];
        }

        /**
         * Pushes a new score to the end of the list.
         *
         * @param score a score.
         */
        public pushScore(score : HighScore) : void {
                this._scores.push(score);

                this._scores.sort((s1, s2) => Math.min(1, Math.max(-1, Math.floor((s2.score - s1.score)))));
                this._scores.splice(9, 1);
                this.save();
        }

        /**
         * Saves the high scores.
         */
        protected save() : void {
                try {
                        const serialized = [];

                        for(var score of this._scores) {
                                serialized.push({
                                        name: score.name,
                                        score: score.score
                                });
                        }

                        window.localStorage.setItem('scores', JSON.stringify(serialized));
                } catch (e) {
                        if (!!console.error) {
                                console.error('Could not load scores: ' + e);
                                console.error('Local storage might not be available.');
                        }
                }
        }

        public padName(name : string) : string {
                var prefix : string = '';

                for (var i : number = 0; i < this.width; ++i) {
                        prefix += ' ';
                }

                return (prefix + name).slice(-this.width);
        }

        /* === Getters & Setters === */

        get width() : number {
                var width : number = 0;

                for (var score of this._scores) {
                        width = Math.max(width, score.name.length);
                }

                return width;
        }
}


/**
 * High Score
 *
 * Represents a high score on the leaderboard.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class HighScore implements Drawable {
        private _leaderboard : Leaderboard;
        private _name : string;
        private _score : number;

        public constructor(leaderboard : Leaderboard, name : string, score : number) {
                this._leaderboard = leaderboard;
                this._name = name;
                this._score = score;
        }

        /**
         * {@inheritDoc}
         */
        public draw(container : Container, delta : number) : void {
                container.drawText(this._leaderboard.padName(this._name) + ('...............' + this._score).slice(-15), '20px Monospace', 'center');
        }

        /* === Getters & Setters === */

        get name() : string {
                return this._name;
        }

        get score() : number {
                return this._score;
        }
}
