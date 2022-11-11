describe("Binary search method for a notebook name from its 'id'", () => {
    test("Binary search testing", () => {
        const arr = [
            { id: 1, name: 'You\'re Lie In April' },
            { id: 2, name: 'Pirates of the Carribbean' },
            { id: 3, name: 'Violet Evergarden' },
            { id: 5, name: 'Stevey Wonder' },
            { id: 8, name: 'Medal of Honor' },
        ];

        const binarySearch = (id) => {
            let low = 0, high = arr.length - 1;
            let mid = 0|(low + (high - low) / 2);
            while (high >= low) {
                if (id > arr[mid].id) { // Greater than mid
                    low = mid + 1;
                    mid = 0|(low + (high - low) / 2);
                } else if (id < arr[mid].id) { // Less than mid
                    high = mid - 1;
                    mid = 0|(low + (high - low) / 2);
                } else { // Found
                    high = low - 1;
                }
            }

            return arr[mid].name;
        }

        expect(binarySearch(1)).toBe('You\'re Lie In April');
        expect(binarySearch(2)).toBe('Pirates of the Carribbean');
        expect(binarySearch(3)).toBe('Violet Evergarden');
        expect(binarySearch(5)).toBe('Stevey Wonder');
        expect(binarySearch(8)).toBe('Medal of Honor');
    });
})