'use strict';


// ----------------------------------------------------------
// Imports
// ----------------------------------------------------------

const https = require('https');
const url = require('url');

// ----------------------------------------------------------
// Globals
// ----------------------------------------------------------

const ddb_tokens = process.env.DDB_TOKENS;
const ddb_messages = process.env.DDB_MESSAGES;

const config = require('./config.json');
console.log('config.json', config);

const message_err = 'Oops, We hit an expected error. Please try again.';



// ----------------------------------------------------------
// Utils
// ----------------------------------------------------------


const send_response = (body, callback) => {
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify(body),
    };
    console.log('Response: ', response);
    callback(null, response);
};



// ----------------------------------------------------------
// Slack Utils
// ----------------------------------------------------------


//
// Post a message to the slack hook.
//
const notify_slack = function(text, hook_url, callback) {
    const slack_hook_url_parts = url.parse(hook_url);

    const options = {
        hostname: slack_hook_url_parts.host,
        port: 443,
        path: slack_hook_url_parts.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    console.log(JSON.stringify(options));

    var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log('data');
            callback(null, chunk);
        });
        res.on('end', function() {
            console.log('end');
            callback(null, null);
        });
    });

    req.on('error', function(err) {
        callback(err, null);
    });

    // write data to request body
    req.write(JSON.stringify({
        text: text
    }));
    req.end();
};


// ----------------------------------------------------------
// Slack Utils
// ----------------------------------------------------------

//
// Handle the CodeBuild CloudWatch Event.
//
module.exports.handle_event = (event, context, callback) => {
    console.log(JSON.stringify(event));

    const detail_type = event['detail-type'];
    const project_name = event.detail['project-name'];
    const build_id = event.detail['build-id'].split(':').pop();
    const link = event.detail["additional-information"]["logs"]["deep-link"];

    let body = {}
    const items = config.items;

    for(let i=0; i < items.length; i++) {
        let item = items[i];
        let _project_name = item["project_name"];
        let _slack_url = item["slack_webhook_url"];

        if( project_name == _project_name ) {
            console.log("MATCH PROJECT: " + project_name);

            let text = '*' + project_name + "*: ";

            if( detail_type.indexOf('Build State') > -1) {
                const build_status = event.detail['build-status'];
                text += '*' + build_status + '*\n';
                text += '> Logs: ' + link + '\n';

            } else if( detail_type.indexOf('Build Phase') > -1) {
                const completed_phase = event.detail['completed-phase'];
                text += completed_phase + '\n';
            }

            text += '> ID: _' + build_id + '_';

            console.log("TEXT", text);

            notify_slack(text, _slack_url, function(err, results) {
                if (err) {
                    console.log('ERROR', err);
                } else {
                    console.log('SUCCESS', results);
                }
            });
        }
    }

    send_response(body, callback);
};


