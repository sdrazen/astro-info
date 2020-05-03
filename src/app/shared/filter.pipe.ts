import { Pipe } from '@angular/core';

@Pipe ({name: 'filter'})

export class FilterArrayPipe {
    transform(value, args) {
        if (args !== undefined) {
            if (!args[0]) {
                return value;
            } else if (value) {
                return value.filter(item => {
                    for (let key in item) {
                        if (String(item[key]).toLowerCase().indexOf(args.toLowerCase()) !== -1 ) {
                            return true;
                        }
                    }
                });
            }
        }
            return value;
    }
}