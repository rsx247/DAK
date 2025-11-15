import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRightIcon, CodeScanIcon, SpinnerIcon, CopyIcon, CheckIcon, WrenchScrewdriverIcon, EditIcon } from '../Layout/Icons';
import { GoogleGenAI } from '@google/genai';

interface Feature {
    title: string;
    description: string;
    status: 'Not Started' | 'In Progress' | 'Done' | 'Fixed';
    scanResult: string;
    implementationPrompt: string;
    fixDetails?: string;
    fixDate?: string;
}

interface FeatureGroup {
    category: string;
    features: Feature[];
}

const initialMajorData: FeatureGroup[] = [
    {
        category: 'User Experience & UI',
        features: [
            { 
                title: 'Media Uploads', 
                description: 'Allow venues to upload images for their location and events to make listings more engaging.',
                status: 'In Progress',
                scanResult: 'Frontend components for upload exist, but backend API endpoint and storage bucket are not configured.',
                implementationPrompt: "Create a backend endpoint to handle image uploads from the client. Integrate with a cloud storage service (like Firebase Storage or Cloudinary) to store the uploaded files. Update the event/venue data models to include image URLs. Finally, connect the existing frontend upload component to this new endpoint and display the uploaded images on the event detail and venue cards."
            },
            { 
                title: 'Actionable Event Icons', 
                description: 'Add icons for actions like "Add to Calendar" or "Share Event" to improve user engagement.',
                status: 'Not Started',
                scanResult: 'Success! No related components found. This can be a new, isolated addition to the EventDetail component.',
                implementationPrompt: "In the `EventDetail.tsx` component, add a new section for action buttons. Create two new components: `AddToCalendarButton` and `ShareButton`. For `AddToCalendarButton`, generate an `.ics` file blob on the fly with the event's details (title, description, start/end times, location) and trigger a download. For `ShareButton`, use the Web Share API (`navigator.share`) to open the native sharing dialog with the event's title and a link to the application."
            }
        ]
    },
    {
        category: 'Data & Backend',
        features: [
            { 
                title: 'User Accounts & Saved Events', 
                description: 'Implement a user authentication system (e.g., Firebase Auth) and allow users to save or "star" events they are interested in, persisting this to a user profile in a database (e.g., Firestore).',
                status: 'Not Started',
                scanResult: 'Warning: This will require significant changes to the data model and the addition of a database and authentication provider. No existing user components found.',
                implementationPrompt: "Integrate Firebase Authentication for email/password and Google Sign-In. Create a new Firestore collection called `users` to store user profiles. When a user 'stars' an event, add the `eventId` to a `savedEvents` array in their user document. Create a new view or a section in the header to display the user's saved events, fetching the data from their profile."
            }
        ]
    }
];

const initialMinorData: FeatureGroup[] = [
     {
        category: 'Minor Changes & Fixes',
        features: [
            {
                title: 'Timeline Zoom Pinch Gesture',
                description: 'Implement pinch-to-zoom functionality on touch devices for the main timeline view to make it more intuitive to navigate.',
                status: 'Not Started',
                scanResult: 'The `TimelineGrid.tsx` component currently uses button clicks for zoom. No touch event handlers are present.',
                implementationPrompt: "In `TimelineGrid.tsx`, add `onTouchStart`, `onTouchMove`, and `onTouchEnd` event listeners to the main scroll container. In the `onTouchStart` handler, record the initial distance between two fingers. In `onTouchMove`, calculate the new distance and determine the scale change. Use this scale change to programmatically adjust the `zoomLevel` state, clamping it between the min and max zoom levels. Remember to call `preventDefault()` on the events to avoid native browser zoom."
            },
            { 
                title: 'Fix Event Detail Close Animation', 
                description: 'The Event Detail panel close animation is slightly jerky on mobile. The panel should smoothly animate off-screen when the close button or backdrop is clicked.',
                status: 'Not Started',
                scanResult: 'The `EventDetail.tsx` component uses state (`isVisible`) and CSS transitions for animations. The `onClose` function is called immediately, which might be removing the component from the DOM before the animation can complete.',
                implementationPrompt: "In `EventDetail.tsx`, modify the `onClose` handler. Instead of calling the parent `onClose` prop directly, first set the `isVisible` state to `false`. Then, use a `setTimeout` with a duration that matches the CSS transition (e.g., 300ms) to call the parent `onClose` prop. This ensures the component remains in the DOM during the closing animation."
            },
        ]
     }
];


interface FutureFeaturesLogProps {
    searchQuery: string;
}

export const FutureFeaturesLog: React.FC<FutureFeaturesLogProps> = ({ searchQuery }) => {
    const [data, setData] = useState<FeatureGroup[]>(() => {
        const combinedData = [...initialMajorData, ...initialMinorData];
        return JSON.parse(JSON.stringify(combinedData));
    });

    const [expandedItem, setExpandedItem] = useState<number | null>(null);
    const [scanResult, setScanResult] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [promptCopied, setPromptCopied] = useState(false);
    
    const [editingFixFor, setEditingFixFor] = useState<number | null>(null);
    const [fixDetails, setFixDetails] = useState('');
    const [fixComment, setFixComment] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    const flattenedFeatures = useMemo(() => {
        let flatIndex = 0;
        return data.flatMap((group, groupIndex) => 
            group.features.map((feature, featureIndex) => ({
                original: feature,
                indices: { groupIndex, featureIndex },
                flatIndex: flatIndex++
            }))
        );
    }, [data]);

    const filteredFeatures = useMemo(() => {
        if (!searchQuery) return flattenedFeatures;
        const lowerQuery = searchQuery.toLowerCase();
        return flattenedFeatures.filter(item => 
            item.original.title.toLowerCase().includes(lowerQuery) ||
            item.original.description.toLowerCase().includes(lowerQuery) ||
            item.original.scanResult.toLowerCase().includes(lowerQuery)
        );
    }, [searchQuery, flattenedFeatures]);

    const completedFeatures = useMemo(() => {
        return flattenedFeatures
            .filter(item => item.original.status === 'Fixed')
            .sort((a, b) => new Date(b.original.fixDate!).getTime() - new Date(a.original.fixDate!).getTime());
    }, [flattenedFeatures]);

    const activeFeatureGroups = useMemo(() => {
        const activeGroups: FeatureGroup[] = [];
        const groupMap = new Map<string, Feature[]>();

        filteredFeatures.forEach(item => {
            if (item.original.status !== 'Fixed') {
                const category = data[item.indices.groupIndex].category;
                if (!groupMap.has(category)) {
                    groupMap.set(category, []);
                }
                groupMap.get(category)!.push(item.original);
            }
        });
        
        groupMap.forEach((features, category) => {
            activeGroups.push({ category, features });
        });
        
        return activeGroups;
    }, [filteredFeatures, data]);
    

    const handleToggle = (index: number) => {
        setExpandedItem(prev => (prev === index ? null : index));
        setScanResult(''); // Reset scan result when toggling
    };
    
    const handleScan = (result: string) => {
        setIsScanning(true);
        setScanResult('');
        setTimeout(() => {
            setScanResult(result);
            setIsScanning(false);
        }, 800);
    };
    
    const handleCopyPrompt = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        setPromptCopied(true);
        setTimeout(() => setPromptCopied(false), 2000);
    };

    const handleMarkAsFixed = (index: number) => {
        setEditingFixFor(index);
        const feature = flattenedFeatures[index].original;
        // Pre-fill with existing details if any, otherwise it will be generated by useEffect
        setFixDetails(feature.fixDetails || '');
        setFixComment(''); // Always reset comment
    };

    const handleGenerateFixDetails = async (title: string, description: string) => {
        setIsGenerating(true);
        setFixDetails('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Based on the following feature request, write a concise, professional changelog entry from the perspective of a developer who has just fixed it. Describe the problem and the solution in technical terms. Feature Title: "${title}". Description: "${description}"`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setFixDetails(response.text.trim());
        } catch (error) {
            console.error("AI generation failed:", error);
            setFixDetails("Error generating summary. Please write one manually.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    useEffect(() => {
        if (editingFixFor !== null) {
            const feature = flattenedFeatures[editingFixFor]?.original;
            // Only auto-generate if there aren't existing details from a previous edit
            if (feature && !feature.fixDetails) {
                handleGenerateFixDetails(feature.title, feature.description);
            }
        }
    // This is intentional. We want this to run ONLY when a new item is selected for fixing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingFixFor]);

    const handleSaveFix = (index: number) => {
        const { groupIndex, featureIndex } = flattenedFeatures[index].indices;
        
        const finalFixDetails = fixComment
            ? `${fixDetails}\n\n**Dev Comment:** ${fixComment}`
            : fixDetails;

        setData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const featureToUpdate = newData[groupIndex].features[featureIndex];
            featureToUpdate.status = 'Fixed';
            featureToUpdate.fixDetails = finalFixDetails;
            featureToUpdate.fixDate = new Date().toISOString();
            return newData;
        });
        setEditingFixFor(null);
        setFixDetails('');
        setFixComment('');
    };
    
    const renderFeature = (feature: Feature, flatIndex: number) => {
        const index = flatIndex;
        const isExpanded = expandedItem === index;
        const statusColors: Record<Feature['status'], string> = {
            'Not Started': 'bg-gray-200 text-gray-700',
            'In Progress': 'bg-blue-100 text-blue-700',
            'Done': 'bg-green-100 text-green-700',
            'Fixed': 'bg-green-100 text-green-700'
        };

        return (
            <div key={index} className="border border-border-color rounded-lg overflow-hidden">
                <button
                    className="w-full text-left p-4 flex justify-between items-center bg-white hover:bg-surface transition-colors"
                    onClick={() => handleToggle(index)}
                    aria-expanded={isExpanded}
                >
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[feature.status]}`}>
                                {feature.status}
                            </span>
                            <h3 className="font-semibold text-text-primary truncate">{feature.title}</h3>
                        </div>
                    </div>
                    <ChevronRightIcon className={`w-5 h-5 text-text-secondary transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
                {isExpanded && (
                    <div className="p-4 bg-white border-t border-border-color space-y-4">
                        <p className="text-sm text-text-secondary">{feature.description}</p>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                             <button onClick={() => handleScan(feature.scanResult)} className="flex-1 px-4 py-2 text-sm font-medium rounded-md border border-border-color text-text-secondary bg-white hover:bg-surface transition-colors flex items-center justify-center gap-2">
                                {isScanning ? <SpinnerIcon className="w-5 h-5" /> : <CodeScanIcon className="w-5 h-5" />}
                                Scan Codebase
                            </button>
                            <button onClick={() => handleCopyPrompt(feature.implementationPrompt)} className="flex-1 px-4 py-2 text-sm font-medium rounded-md border border-border-color text-text-secondary bg-white hover:bg-surface transition-colors flex items-center justify-center gap-2">
                                {promptCopied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
                                {promptCopied ? 'Prompt Copied!' : 'Copy AI Prompt'}
                            </button>
                        </div>

                        {scanResult && (
                             <div className={`p-3 rounded-lg text-sm ${scanResult.toLowerCase().startsWith('success') ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
                                <p><strong>Scan Result:</strong> {scanResult}</p>
                            </div>
                        )}
                        
                        <div className="pt-3 border-t border-dashed border-border-color">
                             <button 
                                onClick={() => handleMarkAsFixed(index)}
                                className="w-full px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                             >
                                <WrenchScrewdriverIcon className="w-5 h-5" />
                                Mark as Fixed
                            </button>
                        </div>
                        
                        {editingFixFor === index && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                                <textarea
                                    value={fixDetails}
                                    onChange={(e) => setFixDetails(e.target.value)}
                                    className="w-full p-2 border border-border-color rounded-md bg-white focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                                    rows={4}
                                    placeholder={isGenerating ? "Generating AI summary..." : "AI-generated fix summary will appear here. You can edit it before saving."}
                                    disabled={isGenerating}
                                />
                                <input
                                    type="text"
                                    value={fixComment}
                                    onChange={(e) => setFixComment(e.target.value)}
                                    className="w-full p-2 border border-border-color rounded-md bg-white focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                                    placeholder="Add an optional comment..."
                                    disabled={isGenerating}
                                />
                                <div className="flex justify-end items-center gap-2">
                                    {isGenerating && <SpinnerIcon className="w-5 h-5 text-text-secondary" />}
                                    <button
                                        onClick={() => { setEditingFixFor(null); setFixDetails(''); setFixComment(''); }}
                                        className="px-3 py-1.5 text-sm font-medium rounded-md border border-border-color text-text-secondary bg-white hover:bg-surface transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleSaveFix(index)}
                                        disabled={isGenerating || !fixDetails.trim()}
                                        className="px-4 py-1.5 text-sm font-medium rounded-md border border-transparent text-white bg-accent hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Save Fix
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
    
    const getFeatureByFlatIndex = (index: number) => {
        return flattenedFeatures.find(f => f.flatIndex === index)?.original;
    }
    
    return (
        <div className="space-y-8">
            {completedFeatures.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-text-primary mb-4">Completed & Fixed</h2>
                     <div className="space-y-3">
                        {completedFeatures.map(item => (
                             <div key={item.flatIndex} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2">
                                            <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <h3 className="font-semibold text-green-800">{item.original.title}</h3>
                                        </div>
                                        <p className="text-sm text-green-700 mt-2 whitespace-pre-wrap">{item.original.fixDetails}</p>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                         <span className="text-xs text-green-600">
                                            {new Date(item.original.fixDate!).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <button 
                                            onClick={() => handleMarkAsFixed(item.flatIndex)}
                                            className="p-1.5 ml-2 rounded-full text-green-700 hover:bg-green-100"
                                            title="Edit fix details"
                                        >
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                {editingFixFor === item.flatIndex && getFeatureByFlatIndex(item.flatIndex) && (
                                    <div className="mt-4 p-4 bg-white rounded-lg space-y-3 border border-border-color">
                                        <h4 className="text-sm font-semibold text-text-primary">Edit Fix Details</h4>
                                        <textarea
                                            value={fixDetails}
                                            onChange={(e) => setFixDetails(e.target.value)}
                                            className="w-full p-2 border border-border-color rounded-md bg-white focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                                            rows={4}
                                        />
                                        <div className="flex justify-end items-center gap-2">
                                            <button
                                                onClick={() => { setEditingFixFor(null); setFixDetails(''); }}
                                                className="px-3 py-1.5 text-sm font-medium rounded-md border border-border-color text-text-secondary bg-white hover:bg-surface transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleSaveFix(item.flatIndex)}
                                                disabled={!fixDetails.trim()}
                                                className="px-4 py-1.5 text-sm font-medium rounded-md border border-transparent text-white bg-accent hover:bg-red-600 transition-colors disabled:bg-gray-300"
                                            >
                                                Update Fix
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeFeatureGroups.map((group) => (
                <div key={group.category}>
                    <h2 className="text-lg font-bold text-text-primary mb-4">{group.category}</h2>
                    <div className="space-y-3">
                        {group.features.map(feature => {
                            const flatItem = filteredFeatures.find(f => f.original.title === feature.title)!;
                            return renderFeature(feature, flatItem.flatIndex);
                        })}
                    </div>
                </div>
            ))}
            
            {searchQuery && activeFeatureGroups.length === 0 && (
                <div className="text-center py-10 text-text-secondary">
                    Geen features gevonden voor "{searchQuery}".
                </div>
            )}
        </div>
    );
};
