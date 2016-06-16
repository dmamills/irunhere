"use strict";

const React = require('react');
const request = require('superagent');

const Uploader = React.createClass({

    _upload(e) {
        e.preventDefault();

        if(this.refs.files.files.length === 0) {
            console.log('no file, no upload!');
            return;
        }

        request.post('/runs')
        .send(new FormData(this.refs.runs))
        .end((err, res) => {
console.log(err);
            this.props.onUpload(res.body.data);
        });
    },
    render() {
        return (
            <form className="upload-runs" ref="runs">
                <h3>Upload Runs</h3>
                <input name="runs" type="file" multiple ref="files"/>
                <button onClick={this._upload}>Upload GPX file(s)</button>
            </form>
        );
    }
});

module.exports = Uploader;
