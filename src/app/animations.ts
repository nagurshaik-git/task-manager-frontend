import { trigger, transition, animate, style, query, group, animateChild, stagger, sequence, state } from '@angular/animations';

const resetRoute = [
    style({ position: 'relative' }),
    query(
        ':enter, :leave',
        [
            style({
                position: 'absolute', // using absolute makes the scroll get stuck in the previous page's scroll position on the new page
                top: 0, // adjust if you have a header so it factors in the height and not cause the router outlet to jump as it animates
                left: 0,
                width: '100%',
                opacity: 0,
            }),
        ],
        { optional: true }
    ),
];
// Route Transition
export const fadeInAnimation =
    trigger('fadeInAnimation', [
        transition('* <=> *', [
            ...resetRoute,
            query(':enter', [style({ opacity: 0 })], {
                optional: true,
            }),
            group([
                query(
                    ':leave',
                    [style({ opacity: 1 }), animate('0.2s', style({ opacity: 0 }))],
                    { optional: true }
                ),
                query(
                    ':enter',
                    [style({ opacity: 0 }), animate('0.5s', style({ opacity: 1 }))],
                    { optional: true }
                ),
            ]),
            query(':enter', animateChild(), { optional: true })
        ]),
    ]);

// Table Row
export const tableRowAnimation =
    trigger('tableRowAnimation', [
        transition(':increment', [
            query(':enter', [
                style({ opacity: 0, transform: 'translateY(-10px)' }),
                stagger('30ms', [
                    animate('300ms', style({ opacity: 1, transform: 'none' })),
                ])
            ], { optional: true }),
        ]),
    ]);

// Task Search
export const collapseExpandAnimation =
    trigger('collapseExpandAnim', [
        // Expanded
        state('false', style({
            opacity: 1,
            height: '*',
            transform: 'none'
        })),
        // Collapsed
        state('true', style({
            opacity: 0,
            height: 0,
            transform: 'scaleY(0)'
        })),
        // Expand
        transition('true => false', [
            animate('400ms'),
        ]),
        // Collapse
        transition('false => true', [
            animate('400ms')
        ]),
    ]);
