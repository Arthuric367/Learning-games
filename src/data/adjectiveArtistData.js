const ADJECTIVE_ARTIST_DATA = {
    themes: [
        {
            id: 'balloons',
            name: 'Balloons',
            instructionTemplate: 'Paint the {size} balloon {color}',
            targets: [
                { id: 'b1', size: 'big', type: 'balloon' },
                { id: 'b2', size: 'small', type: 'balloon' }
            ],
            options: {
                colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
            }
        },
        {
            id: 'clothing',
            name: 'Dress Up',
            instructionTemplate: 'Paint the {item} {color}',
            pool: [
                { id: 'c1', item: 'hat', type: 'clothing' },
                { id: 'c2', item: 'shirt', type: 'clothing' },
                { id: 'c3', item: 'socks', type: 'clothing' },
                { id: 'c4', item: 'shoes', type: 'clothing' },
                { id: 'c5', item: 'dress', type: 'clothing' },
                { id: 'c6', item: 'scarf', type: 'clothing' },
                { id: 'c7', item: 'jacket', type: 'clothing' }
            ],
            selectionCount: 3,
            options: {
                colors: ['pink', 'cyan', 'lime', 'brown', 'gray', 'violet', 'red', 'blue']
            }
        },
        {
            id: 'emotions',
            name: 'Emotions',
            instructionTemplate: 'Paint the {emotion} face {color}',
            pool: [
                { id: 'e1', emotion: 'happy', type: 'face' },
                { id: 'e2', emotion: 'sad', type: 'face' },
                { id: 'e3', emotion: 'surprised', type: 'face' },
                { id: 'e4', emotion: 'angry', type: 'face' },
                { id: 'e5', emotion: 'shy', type: 'face' },
                { id: 'e6', emotion: 'scared', type: 'face' },
                { id: 'e7', emotion: 'bored', type: 'face' }
            ],
            selectionCount: 3,
            options: {
                colors: ['yellow', 'blue', 'red', 'green', 'orange', 'purple', 'teal']
            }
        }
    ],
    roundsPerSession: 8
};

export default ADJECTIVE_ARTIST_DATA;
