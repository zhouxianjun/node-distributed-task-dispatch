/**
 * Created by alone on 17-6-21.
 */
'use strict';
const trc = require('trc');
const Filter = trc.filter.filter;
const QS = require('querystring');
module.exports = class NodeGroupFilter extends Filter {
    selector(ctx, providerMap, routers, configurators, args) {
        let [last] = args.reverse();
        let nodeGroup = typeof last === 'string' ? last : last.nodeGroup;
        if (typeof nodeGroup === 'string' && nodeGroup.length > 0) {
            args.splice(0, 1);
            for (let [provider, invoker] of providerMap) {
                let p = QS.parse(provider);
                if (!p.attr || !p.attr.startsWith('{') || !p.attr.endsWith('}') || JSON.parse(p.attr).nodeGroup !== nodeGroup) {
                    providerMap.delete(provider);
                }
            }
        }
        args.reverse();
    }

    before(ctx, invoker, args) {
        return true;
    }

    after(ctx, result, args) {
    }
};