import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    overlayEmpty: {
        flex: 1,
        marginTop: "40%",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    overlayFilled: {
        flex: 1,
        alignItems: "center",
        marginTop: "8%",
    },
    heartBox: {
        backgroundColor: "#EAAE99",
        padding: 50,
        borderRadius: 20,
        alignItems: "center",
        marginBottom: "22%",
    },
    heartText: {
        marginTop: 10,
        color: "#333",
        fontSize: 18,
        fontWeight: "bold",
    },
    heartIcon: {
        width: 80,
        height: 80,
        borderRadius: 15,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        marginBottom: 10,
    },
    messageText: {
        textAlign: "center",
        fontSize: 16,
        color: "#333",
    },
    bottomTab: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#EAAE99",
        paddingVertical: 12,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: "absolute",
        bottom: 0,
        width: width,
    },
    tab: {
        alignItems: "center",
    },
    tabText: {
        marginTop: 4,
        fontSize: 12,
        color: "#000",
    },
    whiteBackground: {
        backgroundColor: "#fff",
    },
    scrollContent: {
        paddingBottom: 100,
        paddingTop: 10,
    },
    fullWidthCenter: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
        textAlign: "center",
    },
    card: {
        width: (width - 30) / 2,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "white",
        marginBottom: 16,

        // Shadow
        shadowColor: "#000",
        marginHorizontal: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 6,
    },
    topIcons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },
    logo1: {
        width: 30,
        height: 30,
        resizeMode: "contain",
        borderRadius: 8,
    },
    image: {
        width: "100%",
        height: 150,
        resizeMode: "contain",
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    originalPrice: {
        textDecorationLine: "line-through",
        color: "#888",
        marginRight: 5,
    },
    discount: {
        color: "red",
        fontWeight: "bold",
    },
    currentPrice: {
        fontSize: 20,
        fontWeight: "bold",
        color: "red",
    },
    details: {
        marginVertical: 10,
    },
    rating: {
        color: "#888",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    buyButtonFlex: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "red",
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    heartButton: {
        padding: 5,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
    },
    buyButtonText: {
        color: "white",
        fontWeight: "bold",
        marginLeft: 5,
    },
    cartIcon: {
        marginRight: 5,
    },
    status: {
        marginBottom: 2,
        color: "#000",
    },
    statusValue: {
        fontWeight: "bold",
        color: "green",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#555",
    },
    rowWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    platformLogo: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 8,
    },
    fullWidthCenter: {
        width: "100%",
        alignItems: "center",
    },
})