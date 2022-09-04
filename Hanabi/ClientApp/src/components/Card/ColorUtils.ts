export const getColorByCode = (code: number, gameMode: string = "default") : string => {
    switch (code) {
        case 1: {
            return "red";
        }
        case 2: {
            return "blue";
        }
        case 3: {
            return "green";
        }
        case 4: {
            return "yellow";
        }
        case 5: {
            return "violet";
        }
        case 6: {
            if(gameMode === "rainbow")
                return "rainbow";
            else
                return "white";
        }
        default: {
            return "unknown";
        }
    }
}