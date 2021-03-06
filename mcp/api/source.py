import os
import signal

import fooster.web
import fooster.web.query

import mcp.error

import mcp.common.http

import mcp.model.source


class Index(mcp.common.http.AuthHandler):
    group = 0

    def do_get(self):
        if not self.auth.admin:
            raise fooster.web.HTTPError(403)

        return 200, [dict(source) for source in mcp.model.source.items()]

    def do_post(self):
        if not self.auth.admin:
            raise fooster.web.HTTPError(403)

        try:
            mcp.model.source.add(self.request.body['source'], self.request.body['url'])
        except (KeyError, TypeError):
            raise fooster.web.HTTPError(400)
        except mcp.error.BzrError:
            raise fooster.web.HTTPError(400)
        except mcp.error.InvalidSourceError:
            raise fooster.web.HTTPError(403)
        except mcp.error.SourceExistsError:
            raise fooster.web.HTTPError(409)

        self.response.headers['Location'] = '/api/source/' + self.request.body['source']

        return 201, dict(mcp.model.source.get(self.request.body['source']))

class Source(mcp.common.http.AuthHandler):
    group = 1

    def do_get(self):
        if not self.auth.admin:
            raise fooster.web.HTTPError(404)

        try:
            return 200, dict(mcp.model.source.get(self.groups[0]))
        except mcp.error.NoSourceError:
            raise fooster.web.HTTPError(404)

    def do_put(self):
        if not self.auth.admin:
            raise fooster.web.HTTPError(404)

        try:
            mcp.model.source.update(self.groups[0])
        except mcp.error.NoSourceError:
            raise fooster.web.HTTPError(404)

        return 200, dict(mcp.model.source.get(self.groups[0]))

    def do_delete(self):
        if not self.auth.admin:
            raise fooster.web.HTTPError(404)

        try:
            mcp.model.source.remove(self.groups[0])
        except mcp.error.NoSourceError:
            raise fooster.web.HTTPError(404)

        return 204, None


routes = {'/api/source/' + fooster.web.query.regex: Index, '/api/source/(' + mcp.model.source.sources_allowed + ')' + fooster.web.query.regex: Source}
