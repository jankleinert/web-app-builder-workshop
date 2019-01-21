var cluster_subdomain = process.env.CLUSTER_SUBDOMAIN || '';
var web_console_url = process.env.WEB_CONSOLE_URL || '';

if (!web_console_url && cluster_subdomain.startsWith('apps.')) {
    web_console_url = cluster_subdomain.replace('apps.', 'master.');
}

var config = {
    site_title: 'Single Page Web Apps',

    variables: [
        {
            name: 'web_console_url',
            content: web_console_url
        }
    ]
};

module.exports = config;
