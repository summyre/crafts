import { spacing, borderRadius, fontSizes, shadows } from './constants';
import { Theme } from './themes';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export const createStyles = (theme: Theme) => {
    return {
        // layout
        container: {
            flex: 1,
            padding: spacing.lg,
            backgroundColor: theme.colors.background
        },
        scrollView: {
            flex: 1,
            backgroundColor: theme.colors.background
        },
        scrollViewContainer: {
            padding: spacing.lg,
            paddingBotton: spacing.xxxl
        },

        // cards
        card: {
            backgroundColor: theme.colors.card,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            ...shadows.sm
        },
        cardFlat: {
            backgroundColor: theme.colors.card,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: theme.colors.border
        },

        // typography
        title: {
            fontSize: fontSizes.xxxl,
            fontWeight: 'bold' as const,
            color: theme.colors.text,
            marginBottom: spacing.xl
        },
        header: {
            fontSize: fontSizes.xxl,
            fontWeight: '600' as const,
            color: theme.colors.text,
            marginBottom: spacing.lg
        },
        subheader: {
            fontSize: fontSizes.lg,
            fontWeight: '600' as const,
            color: theme.colors.text,
            marginBottom: spacing.md
        },
        body: {
            fontSize: fontSizes.md,
            color: theme.colors.text,
            lineHeight: 20
        },
        caption: {
            fontSize: fontSizes.sm,
            color: `${theme.colors.text}80`
        },
        label: {
            fontSize: fontSizes.sm,
            fontWeight: '600' as const,
            color: theme.colors.text,
            marginBottom: spacing.sm
        },
        subtitle: {
            fontSize: fontSizes.md,
            color: theme.colors.text,
            marginBottom: spacing.xs
        },
        mutedText: {
            color: theme.colors.text,
            fontStyle: 'italic' as const,
            marginBottom: spacing.xxl,
            paddingVerticle: spacing.md,
            textAlign: 'center' as const
        },
        dateText: {
            marginTop: spacing.sm,
            fontSize: fontSizes.sm,
            color: theme.colors.text
        },
        timeText: {
            marginTop: spacing.sm,
            fontStyle: 'italic' as const
        },

        // inputs
        input: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            fontSize: fontSizes.md,
            color: theme.colors.text,
            backgroundColor: theme.colors.card,
            marginBottom: spacing.lg
        },
        textArea: {
            height: 100,
            textAlignVertical: 'top' as const
        },

        // buttons
        buttonPrimary: {
            backgroundColor: theme.colors.primary,
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            alignItems: 'center' as const,
            marginBottom: spacing.lg
        },
        buttonPrimaryText: {
            color: '#fff',
            fontSize: fontSizes.lg,
            fontWeight: 'bold' as const
        },
        buttonSecondary: {
            backgroundColor: theme.colors.card,
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            alignItems: 'center' as const,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: theme.colors.border
        },
        buttonSecondaryText: {
            color: theme.colors.text,
            fontSize: fontSizes.lg,
            fontWeight: '600' as const
        },
        buttonDanger: {
            backgroundColor: '#dc2626',
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            alignItems: 'center',
            marginBottom: spacing.lg
        },
        buttonDangerText: {
            color: '#fff',
            fontSize: fontSizes.lg,
            fontWeight: 'bold' as const
        },
        buttonSmall: {
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: borderRadius.md,
            alignItems: 'center' as const
        },

        // tabs
        tabBar: {
            flexDirection: 'row' as const,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: borderRadius.lg,
            overflow: 'hidden' as const,
            marginBottom: spacing.lg
        },
        tabButton: {
            flex: 1,
            paddingVertical: spacing.md,
            alignItems: 'center' as const,
            backgroundColor: theme.colors.primary
        },
        tabButtonActive: {
            backgroundColor: theme.colors.secondary
        },
        tabText: {
            color: `${theme.colors.text}80`,
            fontSize: fontSizes.sm,
            fontWeight: '600' as const
        },
        tabTextActive: {
            color: '#fff'
        },

        // images
        image: {
            width: '100%',
            borderRadius: borderRadius.lg
        },
        thumbnail: {
            width: '100%',
            height: 150,
            borderRadius: borderRadius.md
        },
        imagePreview: {
            width: 150,
            height: 150,
            borderRadius: borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.border
        },

        // lists
        listItem: {
            padding: spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border
        },
        listContainer: {
            marginBottom: spacing.xxl
        },

        // empty
        emptyState: {
            padding: spacing.xxl,
            alignItems: 'center' as const,
            justifyContent: 'center' as const
        },
        emptyText: {
            fontSize: fontSizes.lg,
            color: `${theme.colors.text}60`,
            textAlign: 'center' as const,
            fontStyle: 'italic' as const
        },

        // spacing utilities
        mb: {
            sm: { marginBottom: spacing.sm },
            md: { marginBottom: spacing.md },
            lg: { marginBottom: spacing.lg },
            xl: { marginBottom: spacing.xl }
        },
        mt: {
            sm: { marginTop: spacing.sm },
            md: { marginTop: spacing.md },
            lg: { marginTop: spacing.lg },
            xl: { marginTop: spacing.xl }
        },
        p: {
            sm: { padding: spacing.sm },
            md: { padding: spacing.md },
            lg: { padding: spacing.lg },
            xl: { padding: spacing.xl }
        }
    };
};

export type AppStyles = ReturnType<typeof createStyles>;

type ProjectDetailStyles = {
    container: ViewStyle;
    headerContainer: ViewStyle;
    scrollViewContainer: ViewStyle;
    timelineItem: ViewStyle;
    timelineImage: ImageStyle;
    timelineContent: ViewStyle;
    timelineCard: ViewStyle;
    timestamp: TextStyle;
    timelineTitle: TextStyle;
    timelineList: ViewStyle;
    startButton: ViewStyle;
    startButtonText: TextStyle;
    photoTitle: TextStyle;
    notes: TextStyle;
    addButton: ViewStyle;
    addButtonText: TextStyle;
    tabBar: ViewStyle;
    tabButton: ViewStyle;
    tabButtonActive: ViewStyle;
    tabText: TextStyle;
    tabTextActive: TextStyle;
    photoCard: ViewStyle;
    photo: ImageStyle;
    smallAddButton: ViewStyle;
    smallAddButtonText: TextStyle;
    gallery: ViewStyle;
    deleteButton: ViewStyle;
    deleteText: TextStyle;
    editText: TextStyle;
    sessionBadge: ViewStyle;
    sessionBadgeText: TextStyle;
    sectionTitle: TextStyle;
    sectionHeader: TextStyle;
    sectionHeaderRow: ViewStyle;
    milestoneButton: ViewStyle;
    patternTitle: TextStyle;
    patternItem: ViewStyle;
    bottomSpacer: ViewStyle;
    sectionSpacer: ViewStyle;
    counterText: TextStyle;
}

export const createProjectDetailStyles = (theme: Theme): ProjectDetailStyles => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    headerContainer: {
        paddingBottom: spacing.lg
    },
    scrollViewContainer: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: spacing.xs
    },
    timelineImage: {
        width: 70,
        height: 70,
        borderRadius: borderRadius.md,
        marginRight: spacing.md,
        flexShrink: 0,
    },
    timelineContent: {
        flex: 1,
        justifyContent: 'center'
    },
    timestamp: {
        fontSize: fontSizes.sm,
        color: `${theme.colors.text}80`,
        marginTop: spacing.xs
    },
    timelineCard: {
        borderWidth: 1,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg
    },
    timelineTitle: {
        fontSize: fontSizes.lg,
        fontWeight: 'bold',
        marginBottom: spacing.sm
    },
    timelineList: {
        marginBottom: spacing.sm
    },
    startButton: {
        padding: spacing.lg,
        backgroundColor: theme.colors.primary,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginBottom: spacing.lg,
        ...shadows.sm
    },
    startButtonText: {
        color: '#fff',
        fontWeight: 'bold' as const,
        fontSize: fontSizes.lg
    },
    photoTitle: {
        fontSize: fontSizes.lg,
        fontWeight: '600' as const,
        marginBottom: spacing.sm,
        color: theme.colors.text
    },
    photoCard: {
        flex: 1/3,
        aspectRatio: 1,
        margin: spacing.xs,
        borderRadius: borderRadius.md,
        overflow: 'hidden' as const,
        borderWidth: 1
    },
    photo: {
        width: '100%',
        height: 200,
        borderRadius: borderRadius.md,
        marginTop: spacing.sm
    },
    notes: {
        fontSize: fontSizes.md,
        marginVertical: spacing.sm,
        color: `${theme.colors.text}80`,
        lineHeight: 15,
        marginTop: spacing.lg
    },
    addButton: {
        padding: spacing.lg,
        borderWidth: 1,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginBottom: spacing.lg,
        borderColor: theme.colors.border
    },
    addButtonText: {
        fontWeight: 'bold' as const,
        fontSize: fontSizes.md,
        color: theme.colors.text
    },
    tabBar: {
        flexDirection: 'row' as const,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: borderRadius.lg,
        overflow: 'hidden' as const,
        marginBottom: spacing.lg
    },
    tabButton: {
        flex: 1,
        paddingVertical: spacing.md,
        alignItems: 'center' as const,
        backgroundColor: theme.colors.card
    },
    tabButtonActive: {
        backgroundColor: theme.colors.primary
    },
    tabText: {
        fontWeight: '600' as const,
        color: `${theme.colors.text}80`,
        fontSize: fontSizes.sm
    },
    tabTextActive: {
        color: '#fff'
    },
    smallAddButton: {
        padding: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    smallAddButtonText: {
        fontSize: fontSizes.sm,
        fontWeight: '600' as const,
        color: theme.colors.text
    },
    gallery: {
        paddingBottom: spacing.xl
    },
    deleteButton: {
        marginTop: spacing.xxxl,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'red',
    },
    deleteText: {
        color: 'red',
        fontWeight: 'bold'
    },
    editText: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: fontSizes.lg
    },
    sessionBadge: {
        backgroundColor: '#e0e7ff',
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginRight: spacing.sm,
        alignSelf: 'flex-start'
    },
    sessionBadgeText: {
        fontSize: fontSizes.xs,
        fontWeight: 'bold'
    },
    sectionTitle: {
        fontSize: fontSizes.xxl,
        fontWeight: 'bold',
        marginTop: spacing.xxl,
        marginBottom: spacing.lg
    },
    sectionHeader: {
        fontSize: fontSizes.xl,
        fontWeight: 'bold',
        marginBottom: spacing.md
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md
    },
    milestoneButton: {            
        marginRight: spacing.md,
        padding: spacing.xs,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.milestone,
        alignSelf: 'flex-start'
    },
    patternTitle: {
        fontSize: fontSizes.xl,
        fontWeight: '600',
        marginBottom: spacing.xs
    },
    patternItem: {
        padding: spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
        backgroundColor: theme.colors.background
    },
    bottomSpacer: {
        height: spacing.xxxl
    },
    sectionSpacer: {
        height: spacing.xl
    },
    counterText: {
        fontSize: fontSizes.md,
        marginBottom: spacing.xs
    }
})