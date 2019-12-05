import _ from 'lodash';

const attrParse = (data = {}) => {
    
    let attrParsed = {};
    
    if(_.isObject(data)) {
        //map id, type, token
        if(data.id) attrParsed['_id'] = data.id;
        if(data.type) attrParsed['_type'] = data.type;
        if(data.token) attrParsed['_token'] = data.token;

        //map attributes
        if(!_.isEmpty(data.attributes)) {
            _.map(data.attributes, (v, i) => {
                attrParsed[i] = v;
            });
        }
        //describe constants
        if(!_.isEmpty(data.dictionary)) {
            _.map(data.dictionary, (v, i) => {
                if(v[attrParsed[i]] != undefined) attrParsed[i] = v[attrParsed[i]];
            });
        }
    }

    return attrParsed;
}

export const __parse = (data = {}) => {

    let parsed = false;

    if(!_.isObject(data)) return parsed;

    if(_.isUndefined(data.data)) {
        parsed = attrParse(data);

        if(!_.isEmpty(data.relationships)) {
            _.forEach(data.relationships, (v, i) => {
                parsed[i] = attrParse(v);
            })
        }

    } else if(!_.isUndefined(data.data) && _.isArray(data.data)) {

        parsed = data;

        _.forEach(data.data, (v, i) => {
            parsed.data[i] = attrParse(v);

            if(!_.isEmpty(v.relationships)) {
                _.forEach(v.relationships, (j, n) => {
                    parsed.data[i][n] = attrParse(j);
                })
            }
        });
    }

    return parsed;
}