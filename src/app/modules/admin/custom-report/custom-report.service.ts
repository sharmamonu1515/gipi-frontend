import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import {
    Document,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    BorderStyle,
    HeadingLevel,
    AlignmentType,
    Packer,
    WidthType,
    convertInchesToTwip,
    PageOrientation,
    ITableBordersOptions,
    PageBorderDisplay,
    PageBorderOffsetFrom,
    ImageRun,
    TextRun,
    Footer,
    PageNumber,
    SectionType,
    TableLayoutType,
    HeightRule,
    VerticalAlign,
    TabStopType,
    TabStopPosition,
    Header,
    TableOfContents,
    StyleLevel,
    UnderlineType,
    ExternalHyperlink,
} from 'docx';
import { saveAs } from 'file-saver';
import { IEPFOData } from 'app/interfaces/custom-report';
import { CurrencyConversionService } from './financial-assessment/currency-conversion.service';
const logoUrl = 'assets/images/logo/logo3.png';
const frontPageUrl = 'assets/images/report-images/Profile.png';
const mainLogoUrl = 'assets/images/logo/logo-text-on-dark2.png';
const comapnyProfileUrl = 'assets/images/report-images/company-profile.png';
const financialUrl = 'assets/images/report-images/financial.png';
const forensicUrl = 'assets/images/report-images/forensic.png';
const evidenceUrl = 'assets/images/report-images/evidence.png';

@Injectable({
    providedIn: 'root',
})
export class CustomReportService {
    ompanyProfileImageBase64: string = '';
    financeSectionImageBase64: string = '';
    private readonly PAGE_WIDTH = 12240;
    private readonly PAGE_MARGINS = {
        top: convertInchesToTwip(1),
        right: convertInchesToTwip(1),
        bottom: convertInchesToTwip(1),
        left: convertInchesToTwip(1),
    };
    private readonly STANDARD_TABLE_STYLE = {
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        layout: TableLayoutType.FIXED,
        margins: {
            top: 100,
            bottom: 100,
            left: 100,
            right: 100,
        },
    };

    private readonly STANDARD_BORDERS: ITableBordersOptions = {
        top: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
        left: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
        right: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
    };

    constructor(private http: HttpClient, private currencyService: CurrencyConversionService) { }

    private safeString(value: any): string {
        if (value === null || value === undefined) {
            return '';
        }
        return String(value);
    }

    async exportToWord(data: any) {
        try {
            const logoResponse = await fetch(logoUrl);
            const logoBlob = await logoResponse.blob();
            const logoUint8Array = new Uint8Array(await logoBlob.arrayBuffer());
            const profileResponse = await fetch(frontPageUrl);
            const profileBlob = await profileResponse.blob();
            const profileUint8Array = new Uint8Array(
                await profileBlob.arrayBuffer()
            );
            const mainLogoResponse = await fetch(mainLogoUrl);
            const mainLogoBlob = await mainLogoResponse.blob();
            const mainLogoUint8Array = new Uint8Array(
                await mainLogoBlob.arrayBuffer()
            );
            const companyProfileResponse = await fetch(comapnyProfileUrl);
            const companyProfileBlob = await companyProfileResponse.blob();
            const companyProfileUint8Array = new Uint8Array(
                await companyProfileBlob.arrayBuffer()
            );
            const financialResponse = await fetch(financialUrl);
            const financialBlob = await financialResponse.blob();
            const financialUint8Array = new Uint8Array(
                await financialBlob.arrayBuffer()
            );
            const forensicResponse = await fetch(forensicUrl);
            const forensicBlob = await forensicResponse.blob();
            const forensicUint8Array = new Uint8Array(
                await forensicBlob.arrayBuffer()
            );
            const evidenceResponse = await fetch(evidenceUrl);
            const evidenceBlob = await evidenceResponse.blob();
            const evidenceUint8Array = new Uint8Array(
                await evidenceBlob.arrayBuffer()
            );

            const doc = new Document({
                styles: {
                    default: {
                        document: {
                            run: {
                                font: 'Calibri',
                            },
                        },
                    },
                },
                sections: [
                    {
                        properties: {
                            page: {
                                size: {
                                    orientation: PageOrientation.PORTRAIT,
                                },
                                margin: {
                                    top: 1440,
                                    right: 1440,
                                    bottom: 1440,
                                    left: 1440,
                                },
                                borders: {
                                    pageBorders: {
                                        offsetFrom: PageBorderOffsetFrom.PAGE,
                                        display: PageBorderDisplay.ALL_PAGES,
                                    },
                                    pageBorderTop: {
                                        style: BorderStyle.SINGLE,
                                        size: 6,
                                        color: '000000',
                                        space: 24,
                                    },
                                    pageBorderRight: {
                                        style: BorderStyle.SINGLE,
                                        size: 6,
                                        color: '000000',
                                        space: 24,
                                    },
                                    pageBorderBottom: {
                                        style: BorderStyle.SINGLE,
                                        size: 6,
                                        color: '000000',
                                        space: 24,
                                    },
                                    pageBorderLeft: {
                                        style: BorderStyle.SINGLE,
                                        size: 6,
                                        color: '000000',
                                        space: 24,
                                    },
                                },
                            },
                            type: SectionType.CONTINUOUS,
                        },
                        headers: {
                            default: new Header({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new ImageRun({
                                                data: logoUint8Array,
                                                transformation: {
                                                    width: 40,
                                                    height: 40,
                                                },
                                                type: 'png',
                                            }),
                                        ],
                                        alignment: AlignmentType.RIGHT,
                                    }),
                                ],
                            }),
                        },
                        footers: {
                            default: new Footer({
                                children: [
                                    new Paragraph({
                                        border: {
                                            top: {
                                                style: BorderStyle.OUTSET,
                                                size: 6,
                                                color: '800000',
                                            },
                                        },
                                        children: [
                                            new TextRun({
                                                text: 'Empliance Technologies Private Limited',
                                                size: 22,
                                                font: 'cambria'
                                            }),
                                            new TextRun({
                                                text: '\tPage ',
                                                size: 22,
                                                font: 'cambria'
                                            }),
                                            new TextRun({
                                                children: [PageNumber.CURRENT],
                                                size: 22,
                                                font: 'cambria'
                                            }),
                                        ],
                                        alignment: AlignmentType.LEFT,
                                        tabStops: [
                                            {
                                                type: TabStopType.RIGHT,
                                                position: TabStopPosition.MAX,
                                            },
                                        ],
                                    }),
                                ],
                            }),
                        },
                        children: [
                            this.createImageParagraph(
                                profileUint8Array,
                                data.companyProfile?.companyForm,
                                mainLogoUint8Array
                            ),
                            new Paragraph({ text: '', pageBreakBefore: true }),
                            new Paragraph({
                                alignment: AlignmentType.LEFT,
                                spacing: {
                                    before: 100,
                                    after: 100,
                                },
                                children: [
                                    new TextRun({
                                        text: 'Table of Contents',
                                        size: 28,
                                        bold: true,
                                        color: '476993',
                                    }),
                                ],
                            }),

                            new TableOfContents('Table of Contents', {
                                hyperlink: true,
                                headingStyleRange: '1-1',

                                stylesWithLevels: [
                                    new StyleLevel('Heading1', 1),
                                ],

                            }),

                            new Paragraph({ text: '', pageBreakBefore: true }),
                            ...this.disclaimerFunction(),

                            new Paragraph({ text: '', pageBreakBefore: true }),
                            ...this.createSectionWiseHeader(
                                'Company Profile',
                                companyProfileUint8Array
                            ),

                            new Paragraph({ text: '', pageBreakBefore: true }),

                            ...this.createCompanyDetailsSection(
                                data.companyProfile?.companyForm
                            ),

                            new Paragraph({ text: '', pageBreakBefore: true }),

                            ...this.createExecutiveSummarySection(
                                data.executiveSummary?.executiveSummaryForm,
                                data.companyProfile?.companyForm
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),
                            ...this.createBackgroundRiskBandSection(
                                data.executiveSummary?.backgroundRiskBand
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),
                            ...this.createSustainabilityScoreSection(
                                data.executiveSummary?.sustainibilityBandScore
                            ),

                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),
                            ...this.createSustainabilityScoreBandSection(
                                data.executiveSummary?.sustainibilityBandForm
                            ),

                            new Paragraph({ text: '', pageBreakBefore: true }),
                            ...this.createOperationalDetailsSection(
                                data.companyProfile?.operationalForm
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),
                            ...this.createGSTDetailsSection(
                                data.companyProfile?.gstDetails
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),

                            ...this.createEpfoFilingSection(
                                data.companyProfile?.epfoDataList
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),

                            ...this.createKeyManagerialSection(
                                data.companyProfile?.keyManagerialPersons
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),
                            ...this.createPastDirectorsSection(
                                data.companyProfile?.pastDirectors
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),
                            ...this.createCreditDetailsSection(
                                data.companyProfile?.creditRating
                            ),

                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),
                            ...this.shareHoldingSummarySection(
                                data?.companyProfile?.shareHoldingSummary,
                                data?.companyProfile?.shareholdingSummaryYears
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),
                            ...this.shareHoldingDataTableSection(
                                data?.companyProfile?.shareHolding,
                                data?.companyProfile?.shareholdingYears
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),
                            ...this.createHoldingCompaniesSection(
                                data.companyProfile?.entityTypes
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),
                            ...this.createMcaDetailsSection(
                                data?.companyProfile?.mcaFiling,
                                data?.companyProfile?.mcaYears
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),
                            ...this.createDirectorNetworkSection(
                                data.companyProfile?.directorsData
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),
                            ...this.createBankChargesSection(
                                data.companyProfile?.bankCharges
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),
                            ...this.createAuditorDetailsSection(
                                data.companyProfile?.auditData,
                                data?.companyProfile?.auditorYears
                            ),

                            new Paragraph({ text: '', pageBreakBefore: true }),

                            ...this.createSectionWiseHeader(
                                'Financial Assessment',
                                financialUint8Array
                            ),
                            new Paragraph({ text: '', pageBreakBefore: true }),
                            ...this.createFinancialSection(
                                data.financialAssessment?.financialData,
                                data?.financialAssessment.financialObservations
                            ),
                            new Paragraph({ text: '', pageBreakBefore: true }),
                            ...this.createProfitLossSheetSection(
                                data.financialAssessment?.profitLossData,
                                data?.financialAssessment
                                    ?.displayProfitLossYears
                            ),
                            new Paragraph({ text: '', pageBreakBefore: true }),
                            ...this.createBalanceSheetSection(
                                data.financialAssessment?.balanceSheetData,
                                data?.financialAssessment
                                    ?.displayeBalanceSheetYears
                            ),
                            new Paragraph({ text: '', pageBreakBefore: true }),
                            ...this.createAssetsSheetSection(
                                data.financialAssessment?.assetsData,
                                data?.financialAssessment
                                    ?.displayeBalanceSheetYears
                            ),
                            new Paragraph({ text: '', pageBreakBefore: true }),

                            ...this.createFinancialRatiosSection(
                                data.financialAssessment.profitabilityRatios,
                                data.financialAssessment.returnRatios,
                                data.financialAssessment.liquidityRatios,
                                data.financialAssessment.turnoverRatios,
                                data.financialAssessment.solvencyRatios,
                                data.financialAssessment.efficiencyRatios,
                                data.financialAssessment.workingCapitalRatios,
                                data.financialAssessment.altmanScore,
                                data.financialAssessment.ratioAnalysisYears
                            ),

                            new Paragraph({ text: '', pageBreakBefore: true }),
                            ...this.createSectionWiseHeader(
                                'Discrete Forensic Assessment',
                                forensicUint8Array
                            ),
                            new Paragraph({ text: '', pageBreakBefore: true }),
                            ...this.createRiskCategorySection(
                                data.forensicAssessment?.riskCategoriesForm,data.forensicAssessment?.matchFoundCount
                            ),
                            new Paragraph({
                                text: '',
                                spacing: { before: 200, after: 200 },
                            }),

                            new Paragraph({ text: '', pageBreakBefore: true }),
                            ...this.createSectionWiseHeader(
                                'Evidence Annexure',
                                evidenceUint8Array
                            ),

                            new Paragraph({ text: '', pageBreakBefore: true }),
                            ...this.createRiskCategoryTables(
                                data.forensicAssessment?.riskCategoriesForm
                            ).flat(),

                            new Paragraph({ text: '', pageBreakBefore: true }),
                            ...this.BottomStaticSection(),

                            new Paragraph({ text: '', pageBreakBefore: true }),
                            this.createEndOfReportPage(mainLogoUint8Array),
                        ],
                    },
                ],
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, 'company_report.docx');
        } catch (error) {
            console.error('Error generating document:', error);
            throw new Error('Failed to generate document: ' + error.message);
        }
    }

    disclaimerFunction() {
        const content = [];
        content.push(...this.createStaticContentSection());

        return content;
    }

    private createImageParagraph(
        imageUint8Array: Uint8Array,
        companyFormData: any,
        mainLogoUint8Array: Uint8Array
    ): Paragraph {
        return new Paragraph({
            children: [
                new ImageRun({
                    data: imageUint8Array,
                    transformation: {
                        width: 600,
                        height: 300,
                    },
                    type: 'png',
                }),

                new TextRun({ text: '\n\n' }),

                new TextRun({
                    text: `Discrete Intelligence Report`,
                    bold: true,
                    size: 56,
                    font: 'Calibri',
                    break: 3,
                }),

                new TextRun({ text: '\n', break: 10 }),

                new TextRun({
                    text: `Company Name: `,
                    bold: true,
                    size: 30,
                    font: 'Calibri',
                }),
                new TextRun({
                    text: companyFormData?.legal_name || 'N/A',
                    size: 30,
                    font: 'Calibri',
                }),
                new TextRun({ text: '\n', break: 2 }),

                new TextRun({
                    text: `CIN: `,
                    bold: true,
                    size: 30,
                    font: 'Calibri',
                }),
                new TextRun({
                    text: companyFormData?.cin || 'N/A',
                    size: 30,
                    font: 'Calibri',
                }),
                new TextRun({ text: '\n', break: 2 }),

                new TextRun({
                    text: `Address: `,
                    bold: true,
                    size: 30,
                    font: 'Calibri',
                }),
                new TextRun({
                    text: companyFormData?.companyAddress || 'N/A',
                    size: 30,
                    font: 'Calibri',
                }),
                new TextRun({ text: '\n', break: 2 }),

                new TextRun({
                    text: `Date of Report: `,
                    bold: true,
                    size: 30,
                    font: 'Calibri',
                }),
                new TextRun({ text: '\n', break: 6 }),

                new TextRun({ text: '\t' }),
                new ImageRun({
                    data: mainLogoUint8Array,
                    transformation: {
                        width: 200,
                        height: 60,
                    },
                    type: 'png',
                }),
            ],
            alignment: AlignmentType.LEFT,
            tabStops: [
                {
                    type: TabStopType.RIGHT,
                    position: 9000,
                },
            ],
        });
    }

    private createSectionHeader(text: string) {
        return new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 200, after: 200 },
            children: [
                new TextRun({
                    text,
                    size: 22,
                    bold: true,
                    color: '000000',
                    underline: {
                        type: UnderlineType.SINGLE,
                    },
                }),
            ],
        });
    }

    private createSectionWiseHeader(
        text: string,
        imageUint8Array: Uint8Array
    ): (Paragraph | ImageRun)[] {
        return [
            new Paragraph({
                children: [
                    new ImageRun({
                        data: imageUint8Array,
                        transformation: {
                            width: 600,
                            height: 250,
                        },
                        type: 'png',
                    }),
                ],
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: text,
                        font: 'Calibri',
                        size: 56,
                        bold: true,
                        break: 1,
                    }),
                ],
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
            }),
        ];
    }

    private createStaticContentSection(): Paragraph[] {
        const paragraphs: Paragraph[] = [];

        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: 'Disclaimer',
                        bold: true,
                        size: 24,
                        font: 'Calibri',
                    }),
                ],
                alignment: AlignmentType.LEFT,
                spacing: { after: 240 },
            })
        );

        const paragraphTexts = [
            'In this document, references to Empliance are references to Empliance Technologies Private Limited. By proceeding to read this Report (Report) Subscriber and any other recipients under the terms of our engagement contract (if any) (together you) confirm their understanding of and aggreement to these conditions.',

            'This report contains information compiled from various sources (including tele-calling) over which Empliance may not have control and / or which may not have been verified independently by Empliance, unless otherwise indicated in this report.',

            'Our views expressed in this Report are based on the facts and assumptions indicated by you and on the existing provisions of law and its interpretation (which are subject to change from time to time). No assurance is given that the compliance monitoring authorities/courts will concur with the views expressed herein.',

            'This Report is confidential and solely for your benefit and for the purpose(s) set out in our engagement letter. You should not disclose or re-distribute our Report to any other party without our prior written consent. Our Report shall always be used in a complete and unaltered form of the Report and accompanied only by such other materials as Empliance may agree.',

            'No third party is entitled to rely on our Report for any purpose whatsoever and we accept no duty of care or liability to any other party who is shown or gains access to this Report. We or any other Empliance Entity shall not be responsible/liable for any loss or liability whatsoever sustained by any other person who relies on this Report (or any part thereof) or takes any action on the basis of the views expressed by us in the Report',

            'Nothing in this Report constitutes a legal opinion or legal advice. Any views made by Empliance should not be relied upon as legal advice or as being suitable for incorporation into any legal document without further consideration by and approval of your legal/other appropriate advisers.',
        ];

        paragraphTexts.forEach((text) => {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: text,
                            size: 22,
                            font: 'Calibri',
                        }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 50 },
                })
            );
        });

        return paragraphs;
    }

    private createTableHeaderRow(
        text: string,
        columnCount: number,
        fontSize: number = 24,
        bgColor: string = '#800000',
        fontColor: string = 'FFFFFF'
    ) {
        return new TableRow({
            children: [
                new TableCell({
                    columnSpan: columnCount,
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: this.STANDARD_BORDERS,
                    shading: { fill: bgColor },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 50, after: 50 },
                            children: [
                                new TextRun({
                                    text: text,
                                    bold: true,
                                    color: fontColor,
                                    size: fontSize,
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        });
    }

    private createStandardCell(
        text: string | number | ExternalHyperlink,
        widthPercentage: number,
        isBold: boolean = false,
        bgColor: string = 'FFFFFF',
        fontSize: number = 22,
        fontColor: string = '000000'
    ) {
        let paragraphChildren: any[] = [];

        if (text instanceof ExternalHyperlink) {
            paragraphChildren.push(text);
        } else {
            paragraphChildren.push(
                new TextRun({
                    text: this.safeString(text),
                    size: fontSize,
                    bold: isBold,
                    color: fontColor,
                })
            );
        }
        return new TableCell({
            margins: {
                top: 80,
                bottom: 80,
                left: 30,
                right: 30,
            },
            width: {
                size: widthPercentage,
                type: WidthType.PERCENTAGE,
            },
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    // spacing: { before: 100, after: 100 },
                    children: paragraphChildren,
                }),
            ],
            borders: this.STANDARD_BORDERS,
            verticalAlign: VerticalAlign.CENTER,
            shading: {
                fill: bgColor,
            },
        });
    }

    private createColorTableHeader(
        cells: string[],
        widths: number[],
        bgColor: string = '#800000',
        fontSize: number = 22,
        fontColor: string = 'FFFFFF'
    ) {
        return new TableRow({
            children: cells.map(
                (text, index) =>
                    new TableCell({
                        width: {
                            size: widths[index],
                            type: WidthType.PERCENTAGE,
                        },
                        shading: {
                            fill: bgColor,
                        },
                        margins: {
                            top: 100,
                            bottom: 100,
                            left: 50,
                            right: 50,
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                // spacing: { before: 100, after: 100 },
                                children: [
                                    new TextRun({
                                        text,
                                        size: fontSize,
                                        bold: true,
                                        color: fontColor,
                                    }),
                                ],
                            }),
                        ],
                        borders: this.STANDARD_BORDERS,
                    })
            ),
        });
    }

    private createTableHeader(
        cells: string[],
        bgColor: string = 'c0c0c0',
        fontSize: number = 22,
        fontColor: string = '000000',
        isYearWise: boolean = false
    ) {
        return new TableRow({
            cantSplit: true,
            children: cells.map(
                (text, index) =>
                    new TableCell({
                        width: {
                            size: isYearWise ? (index === 0 ? 30 : 70 / cells?.length - 1) : 100 / cells.length,
                            type: WidthType.PERCENTAGE,
                        },
                        shading: {
                            fill: bgColor,
                        },
                        margins: {
                            top: 100,
                            bottom: 100,
                            left: 100,
                            right: 100,
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text,
                                        size: fontSize,
                                        bold: true,
                                        color: fontColor,
                                    }),
                                ],
                            }),
                        ],
                        borders: this.STANDARD_BORDERS,
                    })
            ),
        });
    }

    private createSectionRow(
        label: string,
        colspan: number,
        bgColor: string = 'ffffff',
        fontSize: number = 22
    ) {
        return new TableRow({
            children: [
                new TableCell({
                    columnSpan: colspan + 1,
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                    verticalAlign: VerticalAlign.CENTER,
                    shading: {
                        fill: bgColor,
                    },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: label,
                                    size: fontSize,
                                    bold: true,
                                }),
                            ],
                        }),
                    ],
                    borders: this.STANDARD_BORDERS,
                }),
            ],
        });
    }

    private createCompanyDetailsSection(companyForm: any) {
        const formatEmailAsLink = (email: string) => {
            if (!email) return '';
            return new ExternalHyperlink({
                link: `mailto:${email}`,
                children: [
                    new TextRun({
                        text: email,
                        style: 'Hyperlink',
                    }),
                ],
            });
        };

        const formatWebsiteAsLink = (website: string) => {
            if (!website) return '';
            return new ExternalHyperlink({
                link: website,
                children: [
                    new TextRun({
                        text: website,
                        style: 'Hyperlink',
                    }),
                ],
            });
        };

        const dataPairs = [
            [
                { key: 'Company Name', value: companyForm.legal_name },
                { key: 'Report No', value: companyForm.reportNo },
            ],
            [{ key: 'CIN', value: companyForm.cin }],
            [
                { key: 'Age', value: companyForm.age },
                {
                    key: 'Balance Sheet Date',
                    value: companyForm.balanceSheetDate,
                },
            ],
            [
                { key: 'Company Status', value: companyForm.status },
                { key: 'Paid-Up Capital', value: companyForm.paidUpCapital },
            ],
            [
                { key: 'Company Type', value: companyForm.type },
                {
                    key: 'Profit /(Loss) After Tax',
                    value: companyForm.profitLoss,
                },
            ],
            [
                { key: 'Company Sub Category', value: companyForm.subCategory },
                { key: 'Open Charges', value: companyForm.openCharges },
            ],
            [
                {
                    key: 'Email ID',
                    value: formatEmailAsLink(companyForm.email),
                },
                {
                    key: 'Director/Signatory',
                    value: companyForm.directorSignatory,
                },
            ],
            [
                {
                    key: 'Company Website',
                    value: formatWebsiteAsLink(companyForm.website),
                },
                {
                    key: 'Active Compliance',
                    value: companyForm.activeCompliance,
                },
            ],
            [
                // { key: 'Industry', value: companyForm.industry },
                {
                    key: 'Statutory Registration',
                    value: companyForm.statutoryReg,
                },
                { key: 'Company Address:', value: companyForm.companyAddress },
            ],
            // [{ key: 'SIC', value: companyForm.sic }],
            [
                { key: 'Main_Group', value: companyForm.mainGroup },
                { key: 'Sub_Group', value: companyForm.subGroup },
            ],
            [
                { key: 'Listing', value: companyForm.listing },
                { key: 'Contact Number', value: companyForm.contactNo },
            ],
            [
                {
                    key: 'Correspondence Address',
                    value: companyForm.correspondenceAddress,
                },
            ],  
        ];

        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: [
                this.createTableHeaderRow('Company Details', 4),
                ...dataPairs.map((pair) =>
                    this.createDoubleDataRow(pair[0], pair[1])
                ),
            ],
        });

        return [table];
    }

    private createDoubleDataRow(
        data1: { key: string; value: any },
        data2?: { key: string; value: any }
    ) {
        const keyCell = this.createStandardCell(data1.key, 25, true, 'E0E0E0');
        if (!data2) {
            const valueSpanCell = new TableCell({
                columnSpan: 3,
                children: [
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: { before: 100, after: 100 },
                        indent: { left: 180 },
                        children: [
                            new TextRun({
                                text: this.safeString(data1.value || ''),
                                size: 22,
                            }),
                        ],
                    }),
                ],
                borders: this.STANDARD_BORDERS,
                verticalAlign: VerticalAlign.CENTER,
                margins: {
                    top: 100,
                    bottom: 100,
                    left: 60,
                    right: 60,
                },
            });

            return new TableRow({
                children: [keyCell, valueSpanCell],
            });
        }

        const valueCell = this.createStandardCell(data1.value || '', 25);
        const keyCell2 = this.createStandardCell(data2.key, 25, true, 'E0E0E0');
        const valueCell2 = this.createStandardCell(data2.value || '', 25);

        return new TableRow({
            children: [keyCell, valueCell, keyCell2, valueCell2],
        });
    }

    private createOperationalDetailsSection(operationalForm: any) {
        const dataPairs = [
            [
                {
                    key: 'Employee across country',
                    value: operationalForm.employeeAcross,
                },
                {
                    key: 'Employees at location',
                    value: operationalForm.employeesLocation,
                },
            ],
            [
                { key: 'Tax Payer', value: operationalForm.taxPayer },
                {
                    key: 'Company Auditor',
                    value: operationalForm.companyAuditor,
                },
            ],
            [
                { key: 'No. of Customers', value: operationalForm.customerNo },
                {
                    key: 'Type of Customers',
                    value: operationalForm.customerTypes,
                },
            ],
            [
                { key: 'Business Group', value: operationalForm.businessGroup },
                {
                    key: 'Other Entities in Group',
                    value: operationalForm.otherentities,
                },
            ],
        ];

        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: [
                this.createTableHeaderRow('Operational Details', 4),
                ...dataPairs.map((pair) =>
                    this.createDoubleDataRow(pair[0], pair[1])
                ),
            ],
        });

        return [table];
    }

    private createColourRiskeRow(
        label: string,
        value: string,
        color: string = 'FFFFFF'
    ) {
        return new TableRow({
            children: [
                this.createStandardCell(label, 25, true),
                new TableCell({
                    width: {
                        size: 75,
                        type: WidthType.PERCENTAGE,
                    },
                    margins: {
                        top: 50,
                        bottom: 50,
                        left: 30,
                        right: 30,
                    },
                    shading: {
                        fill: color,
                    },
                    verticalAlign: VerticalAlign.CENTER,
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: value,
                                    color: 'FFFFFF',
                                    bold: true,
                                    size: 22,
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        });
    }

    private createColourTableRow(
        label: string,
        value: string,
        color: string = 'FFFFFF',
        fontColor:string= 'FFFFFF'
    ) {
        return new TableRow({
            height: {
                value: 400,
                rule: 'atLeast',
            },
            children: [
                new TableCell({
                    width: {
                        size: 30,
                        type: WidthType.PERCENTAGE,
                    },
                    margins: {
                        top: 100,
                        bottom: 100,
                        left: 150,
                        right: 150,
                    },
                    shading: {
                        fill: color,
                    },
                    verticalAlign: VerticalAlign.CENTER,
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: label,
                                    color: fontColor,
                                    bold: true,
                                    size: 22,
                                }),
                            ],
                        }),
                    ],
                    borders: this.STANDARD_BORDERS,
                }),
                new TableCell({
                    width: {
                        size: 70,
                        type: WidthType.PERCENTAGE,
                    },
                    margins: {
                        top: 100,
                        bottom: 100,
                        left: 150,
                        right: 150,
                    },
                    shading: {
                        fill: 'FFFFFF',
                    },
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: this.safeString(value),
                                    size: 22,
                                }),
                            ],
                        }),
                    ],
                    borders: this.STANDARD_BORDERS,
                }),
            ],
        });
    }

    private createColourScoreTableRow(
        score: string,
        label: string,
        value: string,
        color: string = 'FFFFFF'
    ) {
        return new TableRow({
            height: {
                value: 400,
                rule: 'atLeast',
            },
            children: [
                new TableCell({
                    width: {
                        size: 20,
                        type: WidthType.PERCENTAGE,
                    },
                    margins: {
                        top: 100,
                        bottom: 100,
                        left: 150,
                        right: 150,
                    },
                    verticalAlign: VerticalAlign.CENTER,
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: this.safeString(score),
                                    size: 22,
                                    bold: true,
                                }),
                            ],
                        }),
                    ],
                    borders: this.STANDARD_BORDERS,
                }),
                new TableCell({
                    width: {
                        size: 30,
                        type: WidthType.PERCENTAGE,
                    },
                    margins: {
                        top: 100,
                        bottom: 100,
                        left: 150,
                        right: 150,
                    },
                    shading: {
                        fill: color,
                    },
                    verticalAlign: VerticalAlign.CENTER,
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: label,
                                    color: 'FFFFFF',
                                    bold: true,
                                    size: 22,
                                }),
                            ],
                        }),
                    ],
                    borders: this.STANDARD_BORDERS,
                }),
                new TableCell({
                    width: {
                        size: 50,
                        type: WidthType.PERCENTAGE,
                    },
                    margins: {
                        top: 100,
                        bottom: 100,
                        left: 150,
                        right: 150,
                    },
                    shading: {
                        fill: 'FFFFFF',
                    },
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: this.safeString(value),
                                    size: 22,
                                }),
                            ],
                        }),
                    ],
                    borders: this.STANDARD_BORDERS,
                }),
            ],
        });
    }

    private createGSTDetailsSection(gstDetails: any[]) {
        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: [
                this.createTableHeaderRow('GST Details', 3),
                this.createTableHeader([
                    'GSTIN/UIN',
                    'GSTIN/UIN Status',
                    'State',
                ]),
                ...(gstDetails || []).map(
                    (detail) =>
                        new TableRow({
                            height: {
                                value: 400,
                                rule: 'atLeast',
                            },
                            children: [
                                this.createStandardCell(detail.gstin, 35),
                                this.createStandardCell(detail.status, 35),
                                this.createStandardCell(detail.state, 30),
                            ],
                        })
                ),
            ],
        });

        return [table];
    }

    private createKeyManagerialSection(keyManagerialPersons: any[]) {
        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: [
                this.createTableHeaderRow('Key Managerial Person', 4),
                this.createTableHeader([
                    'Company Directors/Signatories',
                    'DIN',
                    'Designation',
                    'Appointment Date',
                ]),
                ...(keyManagerialPersons || []).map(
                    (person) =>
                        new TableRow({
                            height: {
                                value: 400,
                                rule: 'atLeast',
                            },
                            children: [
                                this.createStandardCell(
                                    person?.companyDirectors,
                                    30
                                ),
                                this.createStandardCell(person?.din, 25),
                                this.createStandardCell(
                                    person?.designation,
                                    25
                                ),
                                this.createStandardCell(
                                    person?.appointmentDate,
                                    20
                                ),
                            ],
                        })
                ),
            ],
        });

        return [table];
    }

    private createPastDirectorsSection(pastDirectors: any[]) {
        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: [
                this.createTableHeaderRow(
                    'Past Directors / Past Signatories',
                    5
                ),
                this.createTableHeader([
                    'Company Directors',
                    'Director DIN',
                    'Designation',
                    'Appointment Date',
                    'Cessation Date',
                ]),
                ...(pastDirectors || []).map(
                    (director) =>
                        new TableRow({
                            height: {
                                value: 400,
                                rule: 'atLeast',
                            },
                            children: [
                                this.createStandardCell(
                                    director?.companyDirectors,
                                    25
                                ),
                                this.createStandardCell(director?.din, 15),
                                this.createStandardCell(
                                    director?.designation,
                                    20
                                ),
                                this.createStandardCell(
                                    director?.appointmentDate,
                                    20
                                ),
                                this.createStandardCell(
                                    director?.cessationDate,
                                    20
                                ),
                            ],
                        })
                ),
            ],
        });

        return [table];
    }

    private createHoldingCompaniesSection(entityTypes: any[]) {
        const sections = [];

        for (const entity of entityTypes || []) {
            if (!entity.companies || entity.companies.length === 0) {
                continue;
            }

            const table = new Table({
                ...this.STANDARD_TABLE_STYLE,
                rows: [
                    this.createTableHeaderRow(`${entity.type}`, 4),
                    this.createTableHeader([
                        'Name of the company',
                        'CIN / FCRN',
                        '% Of shares held',
                        'Status',
                    ]),
                    ...entity.companies.map(
                        (company) =>
                            new TableRow({
                                height: {
                                    value: 400,
                                    rule: 'atLeast',
                                },
                                children: [
                                    this.createStandardCell(
                                        company?.legal_name,
                                        25
                                    ),
                                    this.createStandardCell(company?.cin, 25),
                                    this.createStandardCell(
                                        company?.share_holding_percentage,
                                        25
                                    ),
                                    this.createStandardCell(
                                        company?.status,
                                        25
                                    ),
                                ],
                            })
                    ),
                ],
            });

            sections.push(table);

            sections.push(
                new Paragraph({
                    text: '',
                    spacing: { before: 200, after: 200 },
                })
            );
        }

        if (sections.length === 0) {
            return [];
        }

        return [
            this.createSectionHeader(
                'Particulars of Holding, Subsidiary, Associate Companies & Joint Ventures'
            ),
            ...sections,
        ];
    }

    private createDirectorNetworkSection(directorsData: any[]) {
        const sections = [];

        for (const director of directorsData || []) {
            const table = new Table({
                ...this.STANDARD_TABLE_STYLE,
                rows: [
                    this.createTableHeaderRow(
                        `Company Director: ${director.name}`,
                        3
                    ),
                    this.createTableHeader([
                        'CIN/FCRN',
                        'Current Company',
                        'Appointment Date',
                    ]),
                    ...(director.network?.companies || []).map(
                        (company) =>
                            new TableRow({
                                height: {
                                    value: 400,
                                    rule: 'atLeast',
                                },
                                children: [
                                    this.createStandardCell(company?.cin, 30),
                                    this.createStandardCell(
                                        company?.legal_name,
                                        40
                                    ),
                                    this.createStandardCell(
                                        company?.date_of_appointment_for_current_designation,
                                        30
                                    ),
                                ],
                            })
                    ),
                ],
            });

            sections.push(table);

            sections.push(
                new Paragraph({
                    text: '',
                    spacing: { before: 200, after: 200 },
                })
            );
        }

        return [
            this.createSectionHeader('Key Managerial Person Information'),
            ...sections,
        ];
    }

    private createEpfoFilingSection(epfoDataList: IEPFOData[]) {
        const sections = [];

        for (const establishment of epfoDataList || []) {
            const filingDetails =
                establishment.filing_details?.slice(0, 6) || [];

            const table = new Table({
                ...this.STANDARD_TABLE_STYLE,
                rows: [
                    this.createTableHeaderRow(
                        `Establishment ID: ${establishment.establishment_id} (${establishment.city})`,
                        5
                    ),
                    this.createTableHeader([
                        'TRRN',
                        'Wage Month',
                        'Date of Credit',
                        'No. of Employees',
                        'Amount (₹)',
                    ]),
                    ...filingDetails.map(
                        (detail) =>
                            new TableRow({
                                height: {
                                    value: 400,
                                    rule: 'atLeast',
                                },
                                children: [
                                    this.createStandardCell(detail?.trrn, 20),
                                    this.createStandardCell(
                                        detail?.wage_month,
                                        20
                                    ),
                                    this.createStandardCell(
                                        detail?.date_of_credit,
                                        20
                                    ),
                                    this.createStandardCell(
                                        detail?.no_of_employees,
                                        20
                                    ),
                                    this.createStandardCell(detail?.amount, 20),
                                ],
                            })
                    ),
                ],
            });

            sections.push(table);

            sections.push(
                new Paragraph({
                    text: '',
                    spacing: { before: 200, after: 200 },
                })
            );
        }

        return [this.createSectionHeader('EPFO Filing Details'), ...sections];
    }

    private createAuditorDetailsSection(auditData: any, years: string[]) {
        const auditorFields = [
            {
                label: 'Audit Firm Name',
                field: 'auditor_firm_name',
                labelColor: 'd9d9d9',
                isFontBold: true,
            },
            {
                label: 'Registration Number',
                field: 'firm_registration_number',
                labelColor: 'd9d9d9',
                isFontBold: true,
            },
            {
                label: 'Auditor Name',
                field: 'auditor_name',
                labelColor: 'd9d9d9',
                isFontBold: true,
            },
            {
                label: 'Membership Number',
                field: 'membership_number',
                labelColor: 'd9d9d9',
                isFontBold: true,
            },
            {
                label: 'Auditor Address',
                field: 'address',
                labelColor: 'd9d9d9',
                isFontBold: true,
            },
            { label: 'PAN', field: 'pan', labelColor: 'd9d9d9', isBold: true },
        ];

        const rows = [
            this.createTableHeaderRow('Auditor Details', years.length + 1),
            this.createTableHeader(
                ['Element Name/Years', ...(years || [])],
                'b8cce4',
                22,
                '000000',
                true
            ),
        ];

        auditorFields.forEach((item) => {
            rows.push(
                this.createAuditorRow(
                    item.label,
                    years,
                    auditData,
                    item.field,
                    item.labelColor,
                    false,
                    'ffffff',
                    22,
                    item.isFontBold
                )
            );
        });

        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: rows,
        });

        return [table];
    }

    private createMcaDetailsSection(mcaData: any, years: string[]) {
        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: [
                this.createTableHeaderRow('MCA Filings:', years.length + 1),
                this.createTableHeader(['Particulars', ...years], 'c0c0c0', 22, '000000', true),
                ...mcaData.map((entry) =>
                    this.createDataRow(entry.particulars, years, entry.data)
                ),
            ],
        });

        return [table];
    }

    private shareHoldingSummarySection(shareholdingData: any, years: string[]) {
        const shareHoldingSummaryFields = [
            { label: 'Financial Year', field: 'financial_year' },
            { label: 'Promoter', field: 'promoter' },
            { label: 'Public', field: 'public' },
            { label: 'Total', field: 'total' },
            {
                label: 'Total Preference Shares',
                field: 'total_preference_shares',
            },
            { label: 'Total Equity Shares', field: 'total_equity_shares' },
        ];

        const rows = [
            this.createTableHeaderRow('Ownership Summary', years.length + 1),
            this.createTableHeader(
                ['Fields/Years', ...(years || [])],
                'bfbfbf'
            ),
        ];

        shareHoldingSummaryFields.forEach((item) => {
            rows.push(
                this.createAuditorRow(
                    item.label,
                    years,
                    shareholdingData,
                    item.field
                )
            );
        });

        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: rows,
        });

        return [table];
    }

    private createDataRow(label: string, years: string[], data: any) {
        return new TableRow({
            children: [
                new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                    verticalAlign: VerticalAlign.CENTER,
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: label,
                                    size: 22,
                                }),
                            ],
                        }),
                    ],
                    borders: this.STANDARD_BORDERS,
                }),
                ...years.map(
                    (year) =>
                        new TableCell({
                            width: {
                                size: 80 / years.length,
                                type: WidthType.PERCENTAGE,
                            },
                            margins: {
                                top: 100,
                                bottom: 100,
                                left: 100,
                                right: 100,
                            },
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new TextRun({
                                            text: this.safeString(data[year]),
                                            size: 22,
                                        }),
                                    ],
                                }),
                            ],
                            borders: this.STANDARD_BORDERS,
                        })
                ),
            ],
        });
    }

    private createAuditorRow(
        label: string,
        years: string[],
        auditData: any,
        field: string = null,
        bgColor: string = 'ffffff',
        isBold: boolean = false,
        bgColor2: string = 'ffffff',
        fontSize: number = 22,
        isFontBold: boolean = false
    ) {
        return new TableRow({
            children: [
                new TableCell({
                    width: {
                        size: 30,
                        type: WidthType.PERCENTAGE,
                    },
                    margins: {
                        top: 100,
                        bottom: 100,
                        left: 100,
                        right: 100,
                    },
                    shading: {
                        fill: bgColor,
                    },
                    verticalAlign: VerticalAlign.CENTER,
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text: label,
                                    size: fontSize,
                                    bold: isFontBold,
                                }),
                            ],
                        }),
                    ],
                    borders: this.STANDARD_BORDERS,
                }),
                ...(years || []).map(
                    (year) =>
                        new TableCell({
                            width: {
                                size: 70 / years.length,
                                type: WidthType.PERCENTAGE,
                            },
                            margins: {
                                top: 100,
                                bottom: 100,
                                left: 100,
                                right: 100,
                            },
                            shading: {
                                fill: bgColor2,
                            },
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new TextRun({
                                            text: this.safeString(
                                                auditData[year]?.[field]
                                            ),
                                            size: fontSize,
                                            bold: isBold,
                                        }),
                                    ],
                                }),
                            ],

                            borders: this.STANDARD_BORDERS,
                        })
                ),
            ],
        });
    }

    private createCreditDetailsSection(creditRatings: any[]) {
        if (!creditRatings || creditRatings.length === 0) {
            return [];
        }

        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: [
                this.createTableHeader([
                    'Rating Agency',
                    'Rating Date',
                    'Rating',
                    'Rating Action',
                    'Outlook',
                    'Type of Loan',
                    'Currency',
                    'Amount (₹)',
                ]),
                ...creditRatings.map(
                    (rating) =>
                        new TableRow({
                            cantSplit: true,
                            height: {
                                value: 400,
                                rule: 'atLeast',
                            },
                            children: [
                                this.createStandardCell(
                                    rating?.rating_agency,
                                    8
                                ),
                                this.createStandardCell(
                                    rating?.rating_date,
                                    11
                                ),
                                this.createStandardCell(rating?.rating, 8),
                                this.createStandardCell(rating?.action, 15),
                                this.createStandardCell(
                                    rating?.outlook || '-',
                                    10
                                ),
                                this.createStandardCell(
                                    rating?.type_of_loan,
                                    15
                                ),
                                this.createStandardCell(rating?.currency, 8),
                                this.createStandardCell(
                                    rating?.amount?.toLocaleString() || '0',
                                    25
                                ),
                            ],
                        })
                ),
            ],
        });

        return [this.createSectionHeader('Credit Rating'), table];
    }

    private createBankChargesSection(bankCharges: any[]) {
        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            rows: [
                this.createTableHeaderRow('Bank Wise Charges', 6),
                this.createTableHeader([
                    'Charge Holder',
                    'Amount (Rs in Crore)',
                    'Creation Date',
                    'Last Modification Date',
                    'Date Of satisfaction',
                    'Assets Under Charge',
                ]),
                ...(bankCharges || []).map(
                    (info) =>
                        new TableRow({
                            cantSplit: true,
                            height: {
                                value: 400,
                                rule: 'atLeast',
                            },
                            children: [
                                this.createStandardCell(info?.holder_name, 20),
                                this.createStandardCell(info?.amount, 15),
                                this.createStandardCell(
                                    info?.creation_date,
                                    16
                                ),
                                this.createStandardCell(
                                    info?.filing_date || '-',
                                    16
                                ),
                                this.createStandardCell(
                                    info?.satisfaction_date || '-',
                                    16
                                ),
                                this.createStandardCell(
                                    info?.property_particulars,
                                    17
                                ),
                            ],
                        })
                ),
            ],
        });
        return [table];
    }

    private createFinancialSection(
        financialsData: any[],
        financialObservations: string
    ) {
        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: [
                this.createTableHeaderRow(
                    'Financial Highlights & Recommendations',
                    3
                ),

                ...(financialsData ?? []).map((financials, index) => {
                    let bgColor = 'bfbfbf';
                    if (index === 0 || index === 1) {
                        bgColor = '95b3d7';
                    }

                    if (
                        financials?.field ===
                        'Adverse Remark by Auditor in CARO'
                    ) {
                        const mergedText = `${this.safeString(
                            financials?.comments ?? ''
                        )}`;

                        return new TableRow({
                            height: {
                                value: 400,
                                rule: 'atLeast',
                            },
                            children: [
                                this.createStandardCell(
                                    this.safeString(financials?.field ?? ' '),
                                    30,
                                    true,
                                    bgColor
                                ),

                                this.createMergedCellWithColour(
                                    mergedText,
                                    'FFFFFF',
                                    2
                                ),
                            ],
                        });
                    }
                    return new TableRow({
                        height: {
                            value: 400,
                            rule: 'atLeast',
                        },
                        children: [
                            this.createStandardCell(
                                this.safeString(financials?.field ?? ' '),
                                30,
                                true,
                                bgColor
                            ),
                            this.createStandardCell(
                                this.safeString(financials?.value ?? ' '),
                                30
                            ),
                            this.createStandardCell(
                                this.safeString(financials?.comments ?? ' '),
                                40
                            ),
                        ],
                    });
                }),

                this.createSectionRow('Analyst Findings:', 3, 'd9d9d9'),

                new TableRow({
                    children: [
                        new TableCell({
                            columnSpan: 3,
                            width: {
                                size: 100,
                                type: WidthType.PERCENTAGE,
                            },
                            margins: {
                                top: 100,
                                bottom: 100,
                                left: 100,
                                right: 100,
                            },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    children: [
                                        new TextRun({
                                            // text: this.safeString(financialObservations),
                                            children:
                                                this.convertHtmlToDocxParagraphs(
                                                    financialObservations
                                                ),
                                            size: 22,
                                        }),
                                    ],
                                }),
                            ],
                            shading: {
                                fill: 'ffffff',
                            },
                            borders: this.STANDARD_BORDERS,
                        }),
                    ],
                }),
            ],
        });

        return [table];
    }

    private createFinancialRatiosSection(
        profitabilityRatios: any,
        returnRatios: any,
        liquidityRatios: any,
        turnoverRatios: any,
        solvencyRatios: any,
        efficiencyRatios: any,
        workingCapitalRatios: any,
        altmanScore: any,
        years: string[]
    ) {
        const sectionHeader = this.createSectionHeader(
            'Financial Ratio Analysis'
        );

        const headerRows = [
            this.createTableHeader(
                ['Particulars', ...(years || [])],
                '#800000',
                22,
                'ffffff',
                true
            ),
        ];

        let contentRows = [];

        const convertRatioToData = (ratio: any, years: string[]) => {
            const data: any = {};
            years.forEach((year, index) => {
                data[year] =
                    ratio.values[index] !== undefined
                        ? ratio.values[index]
                        : ' ';
            });
            return data;
        };

        const ratioSections = [
            { title: 'Profitability Ratios', ratios: profitabilityRatios },
            { title: 'Return Ratios', ratios: returnRatios },
            { title: 'Liquidity Ratios', ratios: liquidityRatios },
            { title: 'Turnover Ratios', ratios: turnoverRatios },
            { title: 'Solvency Ratios', ratios: solvencyRatios },
            { title: 'Efficiency Ratios', ratios: efficiencyRatios },
            { title: 'Working Capital Ratios', ratios: workingCapitalRatios },
            { title: 'Performance Scores', ratios: altmanScore },
        ];

        ratioSections.forEach((section) => {
            contentRows.push(
                this.createSectionRow(section.title, years.length, 'bfbfbf')
            );

            section.ratios.forEach((ratio) => {
                contentRows.push(
                    this.createDataRow(
                        ratio.particulars,
                        years,
                        convertRatioToData(ratio, years)
                    )
                );
            });
        });

        const allRows = [...headerRows, ...contentRows];

        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: allRows,
        });

        return [sectionHeader, table];
    }

    private createBalanceSheetSection(balanceSheetData: any, years: string[]) {
        const balanceSheetFields = [
            {
                category: `Shareholder's Funds`,
                items: [
                    { label: 'Equity Share Capital', field: 'share_capital' },
                    {
                        label: 'Securities Premium',
                        field: 'firm_registration_number',
                    },
                    {
                        label: 'General Reserves',
                        field: 'reserves_and_surplus',
                    },
                    {
                        label: 'Capital Redemption Reserve',
                        field: 'capital_reserve',
                    },
                    {
                        label: 'Surplus (Deficit) (Retained earnings)',
                        field: 'retained_earnings',
                    },
                    {
                        label: 'Capital Grants And Subsidies',
                        field: 'capital_grants',
                    },
                    {
                        label: 'Other Comprehensive Income',
                        field: 'other_income',
                    },
                    {
                        label: `Total Shareholder's Funds`,
                        field: 'total_equity',
                        bgColor: 'd9d9d9',
                        isBold: true,
                        bgColor2: 'd9d9d9',
                        isFontBold: true,
                    },
                ],
            },
            {
                category: 'Non-Current Liabilities ',
                items: [
                    {
                        label: 'Debentures And Bonds',
                        field: 'long_term_borrowings',
                    },
                    {
                        label: 'Deferred Tax Liability',
                        field: 'deferred_tax_liabilities_net',
                    },
                    {
                        label: 'Other Provisions',
                        field: 'long_term_provisions',
                    },
                    {
                        label: 'Other Non-Current Liabilities',
                        field: 'other_long_term_liabilities',
                    },
                    {
                        label: 'Total Non-Current Liabilities',
                        field: 'total_non_current_liabilities',
                        bgColor: 'd9d9d9',
                        isBold: true,
                        bgColor2: 'd9d9d9',
                        isFontBold: true,
                    },
                ],
            },
            {
                category: 'Current Liabilities and Provisions',
                items: [
                    { label: 'Accounts Payables', field: 'account_payables' },
                    {
                        label: 'Creditors for Capital Goods',
                        field: 'capital_goods',
                    },
                    {
                        label: 'Unsecured Loans From Banks / Financial Institutions',
                        field: 'unsecured_loans',
                    },
                    {
                        label: 'Unsecured Loans from Others',
                        field: 'unsecured_loans_others',
                    },
                    {
                        label: 'Advances from Customers',
                        field: 'advance_customers',
                    },
                    {
                        label: 'Debentures And Bonds',
                        field: 'debentures_bonds',
                    },
                    { label: 'Provisions', field: 'short_term_provisions' },
                    { label: 'Deposits', field: 'deposits' },
                    { label: 'Duties and Taxes Payable', field: 'duties_tax' },
                    {
                        label: 'Current Tax Liabilities',
                        field: 'current_tax_liabilities',
                    },
                    {
                        label: 'Total Current Liabilities and Provisions',
                        field: 'total_current_liabilities',
                        bgColor: 'd9d9d9',
                        isBold: true,
                        bgColor2: 'd9d9d9',
                        isFontBold: true,
                    },
                    {
                        label: 'Equity + Liabilities',
                        field: 'given_liabilities_total',
                        bgColor: 'bfbfbf',
                        isBold: true,
                        bgColor2: 'bfbfbf',
                        isFontBold: true,
                    },
                ],
            },
        ];
        const sectionHeader = new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 200, after: 200 },
            children: [
                new TextRun({
                    text: "Balance Sheet",
                    size: 22,
                    bold: true,
                    color: "000000",
                    underline: { type: UnderlineType.SINGLE },
                }),
                new TextRun({
                    text: this.currencyService.getCurrentUnit() === "INR" ? "\t\t\t\t\t\t\t\t\t\t" : "\t\t\t\t\t\t\t\t\t",
                }),
                new TextRun({
                    text: this.currencyService.getCurrentUnit() === "INR" ? "(INR)" : `(INR in ${this.currencyService.getCurrentUnit()})`,
                    size: 22,
                    bold: true,
                    color: "000000",
                }),
            ],
        });

        const headerRows = [
            this.createTableHeader(
                ['Liabilities', ...(years || [])],
                '#800000',
                22,
                'ffffff',
                true
            ),
        ];
        const contentRows = balanceSheetFields.flatMap((category) => {
            const sectionRow = [
                this.createSectionRow(
                    category.category,
                    years.length,
                    'bfbfbf'
                ),
            ];

            const itemRows = category.items.map((item) =>
                this.createAuditorRow(
                    item.label,
                    years,
                    balanceSheetData,
                    item.field,
                    item.bgColor,
                    item.isBold,
                    item.bgColor2,
                    22,
                    item.isFontBold
                )
            );

            return [...sectionRow, ...itemRows];
        });

        const allRows = [...headerRows, ...contentRows];

        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: allRows,
        });

        return [sectionHeader, table];
    }

    private shareHoldingDataTableSection(
        shareholdingData: any,
        years: string[]
    ) {
        const shareholderFields = [
            {
                label: 'Bank Held Percentage of Shares',
                field: 'bank_held_percentage_of_shares',
            },
            {
                label: 'Body Corporate Held Percentage of Shares',
                field: 'body_corporate_held_percentage_of_shares',
            },
            {
                label: 'Central Government Held Percentage of Shares',
                field: 'central_government_held_percentage_of_shares',
            },
            {
                label: 'Financial Institutions Held Percentage of Shares',
                field: 'financial_institutions_held_percentage_of_shares',
            },
            {
                label: 'Financial Institutions Investors Held Percentage of Shares',
                field: 'financial_institutions_investors_held_percentage_of_shares',
            },
            {
                label: 'Foreign Held (Other than NRI) Percentage of Shares',
                field: 'foreign_held_other_than_nri_percentage_of_shares',
            },
            {
                label: 'Government Company Held Percentage of Shares',
                field: 'government_company_held_percentage_of_shares',
            },
            {
                label: 'Indian Held Percentage of Shares',
                field: 'indian_held_percentage_of_shares',
            },
            {
                label: 'Insurance Company Held Percentage of Shares',
                field: 'insurance_company_held_percentage_of_shares',
            },
            {
                label: 'Mutual Funds Held Percentage of Shares',
                field: 'mutual_funds_held_percentage_of_shares',
            },
            {
                label: 'NRI Held Percentage of Shares',
                field: 'nri_held_percentage_of_shares',
            },
            {
                label: 'Others Held Percentage of Shares',
                field: 'others_held_percentage_of_shares',
            },
            {
                label: 'State Government Held Percentage of Shares',
                field: 'state_government_held_percentage_of_shares',
            },
            {
                label: 'Venture Capital Held Percentage of Shares',
                field: 'venture_capital_held_percentage_of_shares',
            },
            {
                label: 'Total Percentage of Shares',
                field: 'total_percentage_of_shares',
                bgColor: 'd9d9d9',
                isBold: true,
                isFontBold: true,
                bgColor2: 'd9d9d9',
            },
        ];

        const categories = [
            {
                category: 'Promoter',
                categoryKey: 'promoter',
                items: shareholderFields,
            },
            {
                category: 'Public',
                categoryKey: 'public',
                items: shareholderFields,
            },
        ];

        const headerRows = [
            this.createTableHeaderRow('Ownership Details (%)', years.length + 1),
            this.createTableHeader(
                [`Stakeholder's`, ...(years || [])],
                'bfbfbf',
                22,
                '000000'
            ),
        ];

        const contentRows = categories.flatMap((category) => {
            const sectionRow = [
                this.createSectionRow(
                    category.category,
                    years.length,
                    'd9d9d9'
                ),
            ];

            const itemRows = category.items.map((item) => {
                const categoryData = {};
                years.forEach((year) => {
                    const yearData = shareholdingData[year]
                        ? shareholdingData[year][category.categoryKey] || {}
                        : {};

                    categoryData[year] = yearData;
                });

                return this.createAuditorRow(
                    item.label,
                    years,
                    categoryData,
                    item.field,
                    item.bgColor,
                    item.isBold,
                    item.bgColor2,
                    22,
                    item.isFontBold
                );
            });

            return [...sectionRow, ...itemRows];
        });

        const allRows = [...headerRows, ...contentRows];

        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: allRows,
        });

        return [table];
    }

    private createAssetsSheetSection(assetsData: any, years: string[]) {
        const assetStructure = [
            {
                category: 'Fixed Assets',
                items: [
                    { label: 'Land & Buildings', field: 'land_building' },
                    { label: 'Plant & Equipment', field: 'plant_equipment' },
                    {
                        label: 'Transportation Vehicles',
                        field: 'transportation',
                    },
                    { label: 'Office Equipment', field: 'office_equipment' },
                    {
                        label: 'Computers and Other IT Equipment',
                        field: 'it_equipment',
                    },
                    {
                        label: 'Furniture, Fixtures and Fittings',
                        field: 'furniture',
                    },
                    { label: 'Other Fixed Assets', field: 'pan' },
                    {
                        label: 'Assets Under Construction',
                        field: 'under_construction',
                    },
                    { label: 'ROUA', field: 'roua' },
                    { label: 'Other Intangibles (Intangible Assets Under Construction)', field: 'intangible_assets' },
                    {
                        label: 'Total Fixed Assets',
                        field: 'total_fixed_assets',
                        bgColor: 'd9d9d9',
                        isBold: true,
                        bgColor2: 'd9d9d9',
                        isFontBold: true,
                    },
                ],
            },
            {
                category: 'Non-Current Assets',
                items: [
                    { label: 'Investments', field: 'noncurrent_investments' },
                    {
                        label: 'Advance for Capital Assets',
                        field: 'advance_capital',
                    },
                    {
                        label: 'Deferred Tax Assets',
                        field: 'deferred_tax_assets_net',
                    },
                    {
                        label: 'Trade, Security and Other Deposits',
                        field: 'other_deposits',
                    },
                    {
                        label: 'Non-Current Assets held for Sale',
                        field: 'non_current_assest_for_sale',
                    },
                    {
                        label: 'Derivative Instruments',
                        field: 'derivative_instruments',
                    },
                    {
                        label: 'Other Non-Current Assets',
                        field: 'other_noncurrent_assets',
                    },
                    {
                        label: 'Total Non-Current Assets',
                        field: 'total_noncurrent_assets',
                        bgColor: 'd9d9d9',
                        isBold: true,
                        bgColor2: 'd9d9d9',
                        isFontBold: true,
                    },
                ],
            },
            {
                category: 'Current Assets',
                items: [
                    { label: 'Cash & Bank', field: 'cash_and_bank_balances' },
                    {
                        label: 'Current Investments',
                        field: 'current_investments',
                    },
                    { label: 'Inventories', field: 'inventories' },
                    {
                        label: 'Accounts Receivable',
                        field: 'amount_receivables',
                    },
                    { label: 'Prepaid Expenses', field: 'prepaid_expenses' },
                    {
                        label: 'Duties and Taxes Receivables',
                        field: 'duties_receivables',
                    },
                    { label: 'Deposits', field: 'deposits' },
                    {
                        label: 'Advances To Suppliers',
                        field: 'advance_suppliers',
                    },
                    {
                        label: 'Other Current Assets',
                        field: 'other_current_assets',
                    },
                    {
                        label: 'Total Current Assets',
                        field: 'total_current_assets',
                        bgColor: 'a6a6a6',
                        isBold: true,
                        bgColor2: 'a6a6a6',
                        isFontBold: true,
                    },
                    {
                        label: 'Total Assets',
                        field: 'total_assets',
                        bgColor: 'd9d9d9',
                        isBold: true,
                        bgColor2: 'd9d9d9',
                        isFontBold: true,
                    },
                ],
            },
        ];

        const sectionHeader = new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 200, after: 200 },
            children: [
                new TextRun({
                    text: this.currencyService.getCurrentUnit() === "INR" ? "\t\t\t\t\t\t\t\t\t\t\t" : "\t\t\t\t\t\t\t\t\t\t",
                }),
                new TextRun({
                    text: this.currencyService.getCurrentUnit() === "INR" ? "(INR)" : `(INR in ${this.currencyService.getCurrentUnit()})`,
                    size: 22,
                    bold: true,
                    color: "000000",
                }),
            ],
        });

        const headerRows = [
            this.createTableHeader(
                ['Assets', ...(years || [])],
                '#800000',
                22,
                'ffffff',
                true
            ),
        ];

        const contentRows = assetStructure.flatMap((category) => {
            const sectionRow = [
                this.createSectionRow(
                    category.category,
                    years.length,
                    'bfbfbf'
                ),
            ];

            const itemRows = category.items.map((item) =>
                this.createAuditorRow(
                    item.label,
                    years,
                    assetsData,
                    item.field,
                    item.bgColor,
                    item.isBold,
                    item.bgColor2,
                    22,
                    item.isFontBold
                )
            );

            return [...sectionRow, ...itemRows];
        });

        const allRows = [...headerRows, ...contentRows];

        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: allRows,
        });

        return [sectionHeader, table];
    }

    private createProfitLossSheetSection(profitLossData: any, years: string[]) {
        const profitLossFields = [
            {
                label: 'Revenue',
                field: 'net_revenue',
                bgColor: 'd9d9d9',
                isBold: true,
                bgColor2: 'd9d9d9',
                isFontBold: true,
            },
            { label: 'Less: Direct Expenditure', field: 'direct_expenditure' },
            { label: 'Salaries and Wages', field: 'salaries_wages' },
            {
                label: 'Gross Profit',
                field: 'gross_profit',
                bgColor: 'd9d9d9',
                isBold: true,
                bgColor2: 'd9d9d9',
                isFontBold: true,
            },
            {
                label: 'Less: General and Administration Expenses',
                field: 'adminstration_expense',
            },
            {
                label: 'Less: Selling and Distribution Expenses',
                field: 'distribution_expense',
            },
            {
                label: 'Less: Depreciation / Amortization',
                field: 'depreciation',
            },
            {
                label: 'Less: Non – Operating Expenses',
                field: 'operating_expense',
            },
            {
                label: 'Operating Profit',
                field: 'operating_profit',
                bgColor: 'd9d9d9',
                isBold: true,
                bgColor2: 'd9d9d9',
                isFontBold: true,
            },
            {
                label: 'Add: Non-Operating Income',
                field: 'non_operating_income',
            },
            {
                label: 'Earnings Before Interest and Tax (EBIT)',
                field: 'ebita',
                bgColor: 'd9d9d9',
                isBold: true,
                bgColor2: 'd9d9d9',
                isFontBold: true,
            },
            {
                label: 'Less: Interest Expenditure',
                field: 'interest_expenditure',
            },
            {
                label: 'Earnings Before Tax (EBT)',
                field: 'earning_before_tax',
                bgColor: 'd9d9d9',
                isBold: true,
                bgColor2: 'd9d9d9',
                isFontBold: true,
            },
            { label: 'Add: Exceptional item', field: 'exceptional_item' },
            {
                label: 'Net Profit Before Taxation & After Extraordinary Items',
                field: 'net_profit_before_tax',
                bgColor: 'd9d9d9',
                isBold: true,
                bgColor2: 'd9d9d9',
                isFontBold: true,
            },
            {
                label: 'Less: Total Tax Provision',
                field: 'total_tax_provision',
            },
            {
                label: 'Profit after Tax and Extraordinary Items',
                field: 'profit_after_tex',
                bgColor: 'd9d9d9',
                isBold: true,
                bgColor2: 'd9d9d9',
                isFontBold: true,
            },
        ];

        const sectionHeader = new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 200, after: 200 },
            children: [
                new TextRun({
                    text: "Profit and Loss Account:",
                    size: 22,
                    bold: true,
                    color: "000000",
                    underline: { type: UnderlineType.SINGLE },
                }),
                new TextRun({
                    text: this.currencyService.getCurrentUnit() === "INR" ? "\t\t\t\t\t\t\t\t" : "\t\t\t\t\t\t\t",
                }),
                new TextRun({
                    text: this.currencyService.getCurrentUnit() === "INR" ? "(INR)" : `(INR in ${this.currencyService.getCurrentUnit()})`,
                    size: 22,
                    bold: true,
                    color: "000000",
                }),
            ],
        });

        const rows = [
            this.createTableHeader(
                ['Particulars', ...(years || [])],
                '#800000',
                22,
                'ffffff',
                true
            ),
        ];

        profitLossFields.forEach((item) => {
            rows.push(
                this.createAuditorRow(
                    item.label,
                    years,
                    profitLossData,
                    item.field,
                    item.bgColor,
                    item.isBold,
                    item.bgColor2,
                    22,
                    item.isFontBold
                )
            );
        });

        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: rows,
        });

        return [sectionHeader, table];
    }

    private createExecutiveSummarySection(
        executiveForm: any,
        companyForm: any
    ) {
        const riskColors: { [key: string]: string } = {
            Critical: '#B20000',
            Caution: '#cc6d00',
            Normal: '#ffbf00',
            Stable: '#66cc00',
            Secure: '#008000',
            NRI: 'FFFFFF',
            OutOfBusiness: '000000',
        };
        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: [
                this.createTableHeaderRow('Executive Summary', 2),
                this.createTableHeaderRow('', 2, 22, 'ffffff', 'ffffff'),
                this.createColourRiskeRow(
                    'Risk Band',
                    executiveForm?.riskBand,
                    riskColors[executiveForm?.riskBand]
                ),
                this.createTableHeaderRow(
                    'Analyst Comment',
                    2,
                    22,
                    'ffffff',
                    '000000'
                ),
                this.createFormattedTableRow(
                    'Description',
                    companyForm?.description
                ),
                this.createFormattedTableRow(
                    'About Entity',
                    executiveForm?.aboutEntity
                ),
                this.createFormattedTableRow(
                    'Management Assessment',
                    executiveForm?.managementAssessment
                ),
                this.createFormattedTableRow(
                    'Operational Assessment',
                    executiveForm?.operationalAssessment
                ),
                this.createFormattedTableRow(
                    'Financial Assessment',
                    executiveForm?.financialAssessment
                ),
                this.createFormattedTableRow(
                    'Legal/Compliance Assessment',
                    executiveForm?.complianceAssessment
                ),
                this.createFormattedTableRow(
                    'Other Comments & Disclaimer',
                    executiveForm?.commentsDisclaimer
                ),
            ],
        });

        return [table];
    }

    private createFormattedTableRow(label: string, htmlContent: string) {
        return new TableRow({
            children: [
                this.createStandardCell(label, 25, true, 'E0E0E0'),
                new TableCell({
                    margins: {
                        top: 50,
                        bottom: 50,
                        left: 30,
                        right: 30,
                    },
                    width: {
                        size: 75,
                        type: WidthType.PERCENTAGE,
                    },
                    children: this.convertHtmlToDocxParagraphs(htmlContent),
                    borders: this.STANDARD_BORDERS,
                    verticalAlign: VerticalAlign.CENTER,
                }),
            ],
            height: {
                value: 400,
                rule: HeightRule.ATLEAST,
            },
        });
    }

    private convertHtmlToDocxParagraphs(html: string): Paragraph[] {
        if (!html) return [new Paragraph('')];

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const paragraphs: Paragraph[] = [];

        tempDiv.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent?.trim();
                if (text) {
                    paragraphs.push(
                        new Paragraph({
                            children: [new TextRun({ text, size: 22 })],
                            spacing: { before: 100, after: 100 },
                        })
                    );
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;
                const computedStyle = window.getComputedStyle(element);

                const text = element.textContent?.trim() || '';
                if (text) {
                    const textRun = new TextRun({
                        text,
                        bold:
                            computedStyle.fontWeight === 'bold' ||
                            parseInt(computedStyle.fontWeight) >= 600,
                        color: computedStyle.color.replace(/\s/g, ''),
                    });

                    paragraphs.push(
                        new Paragraph({
                            children: [textRun],
                            spacing: { before: 100, after: 100 },
                        })
                    );
                }
            }
        });

        return paragraphs.length > 0 ? paragraphs : [new Paragraph('')];
    }

    private createBackgroundRiskBandSection(backgroundRiskBand: any) {
        const riskColors: { [key: string]: string } = {
            critical: '#B20000',
            caution: '#ea580c',
            normal: '#ffbf00',
            stable: '008000',
            secure: '#66cc00',
            noRisk: 'FFFFFF',
            outOfBusiness: '000000',
        };

        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: [
                this.createTableHeaderRow('Background Risk Band', 2),
                this.createColorTableHeader(
                    ['Band Particulars', 'Our Evaluation Criteria'],
                    [30, 70],
                    'dbe5f1',
                    22,
                    '000000'
                ),
                this.createColourTableRow(
                    'Critical',
                    backgroundRiskBand?.Critical,
                    riskColors['critical']
                ),
                this.createColourTableRow(
                    'Caution',
                    backgroundRiskBand?.Caution,
                    riskColors['caution']
                ),
                this.createColourTableRow(
                    'Normal',
                    backgroundRiskBand?.Normal,
                    riskColors['normal']
                ),
                this.createColourTableRow(
                    'Stable',
                    backgroundRiskBand?.Stable,
                    riskColors['stable']
                ),
                this.createColourTableRow(
                    'Secure',
                    backgroundRiskBand?.Secure,
                    riskColors['secure']
                ),
                this.createColourTableRow(
                    'NRI- No Risk Identified',
                    backgroundRiskBand?.NRI,
                    riskColors['noRisk'],
                    '000000'
                ),
                this.createColourTableRow(
                    'Out of Business (OOB)',
                    backgroundRiskBand?.OutOfBusiness,
                    riskColors['outOfBusiness']
                ),
            ],
        });

        return [table];
    }

    private createSustainabilityScoreSection(sustainabilityScore: any[]) {
        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: [
                this.createTableHeaderRow('Sustainability Score', 3),
                this.createColorTableHeader(
                    ['Parameter', 'Weight', 'Score'],
                    [60, 20, 20],
                    'bfbfbf',
                    22,
                    '000000'
                ),
                ...(sustainabilityScore || []).map((info) => {
                    let bgColor = 'FFFFFF';
                    let riskLabel = '';
                    let parameterBgColor = 'b8cce4';
                    let parameterFontColor = '000000';
                    let fontColor = '000000';
                    let isRiskRow = info?.parameter === 'Risk Score Range';
                    let isBold = false;
                    // let isOverriding=info?.parameter==='Overriding Factors'

                    if (isRiskRow) {
                        const partnerScore = sustainabilityScore.find(
                            (s) =>
                                s.parameter === 'Partner Sustainability Score'
                        )?.score;
                        const riskDetails = this.getRiskDetails(partnerScore);

                        if (riskDetails) {
                            bgColor = riskDetails.color;
                            riskLabel = riskDetails.label;
                            parameterBgColor = '17365d';
                            parameterFontColor = 'ffffff';
                            isBold = true;
                        }
                    }
                    if (info?.parameter === 'Partner Sustainability Score') {
                        isBold = true;
                    }

                    if (info?.parameter === 'Overriding Factors') {
                        info.parameter =
                            'Over-riding Factors* (Comprehensive credit, issuance of shares, significant arbitration proceeding)';
                        fontColor = 'ff0000';
                    }

                    return new TableRow({
                        height: {
                            value: 400,
                            rule: 'atLeast',
                        },
                        children: [
                            this.createStandardCell(
                                info?.parameter,
                                60,
                                true,
                                parameterBgColor,
                                22,
                                parameterFontColor
                            ),

                            ...(isRiskRow
                                ? [
                                    this.createMergedCellWithColour(
                                        riskLabel,
                                        bgColor,
                                        2
                                    ),
                                ]
                                : [
                                    this.createStandardCell(
                                        info?.weight,
                                        20,
                                        isBold
                                    ),
                                    this.createStandardCell(
                                        info?.score,
                                        20,
                                        false,
                                        bgColor,
                                        22,
                                        fontColor
                                    ),
                                ]),
                        ],
                    });
                }),
            ],
        });

        return [table];
    }

    private createMergedCellWithColour(
        text: string,
        bgColor: string = 'FFFFFF',
        columnSpan: number = 1
    ) {
        return new TableCell({
            columnSpan,
            margins: {
                top: 100,
                bottom: 100,
                left: 150,
                right: 150,
            },
            width: {
                size: 20 * columnSpan,
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: this.safeString(text),
                            size: 22,
                            color: 'FFFFFF',
                            bold: true,
                        }),
                    ],
                }),
            ],
            borders: this.STANDARD_BORDERS,
            shading: {
                color: bgColor,
                fill: bgColor,
            },
        });
    }

    private getRiskDetails(
        score: number | string | null | undefined
    ): { color: string; label: string } | null {
        if (score === null || score === undefined || score === '') {
            return null;
        }

        const numScore = parseFloat(String(score));
        if (isNaN(numScore)) return null;

        if (numScore >= 86) return { color: '#008000', label: 'Low Risk' };
        if (numScore >= 73) return { color: '#66cc00', label: 'Moderate Risk' };
        if (numScore >= 56) return { color: '#ffbf00', label: 'Average Risk' };
        if (numScore >= 34)
            return { color: '#ea580c', label: 'Below Average Risk' };

        return { color: '#B20000', label: 'High Risk' };
    }

    private createSustainabilityScoreBandSection(
        sustainabilityRiskBand: any[]
    ) {
        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: [
                this.createTableHeaderRow('Sustainability Risk Bands', 3),
                this.createColorTableHeader(
                    [
                        'Score Range',
                        'Performance Indicator',
                        'Our Evaluation Criteria',
                    ],
                    [20, 30, 50],
                    'dbe5f1',
                    22,
                    '000000'
                ),
                ...sustainabilityRiskBand.map((info) =>
                    this.createColourScoreTableRow(
                        info.score,
                        info.label,
                        info.value,
                        info.color
                    )
                ),
            ],
        });

        return [table];
    }

    private createRiskCategorySection(riskCategories: any[],matchFoundCount: any) {
        const sectionHeader = new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 200, after: 200 },
            children: [
                new TextRun({
                    text: `\t\t\t\t\t\t\t\t\t\tMatch Found: ${matchFoundCount}`
                }),
            ],
        });
        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            rows: [
                this.createTableHeader([
                    'Category',
                    'Result',
                    'Tags',
                    'Recommended Actions',
                ],'800000',22,'ffffff'),
                ...(riskCategories || []).map((info) => {
                    const resultColor =
                        info?.result === 'Match Found'
                            ? 'FF0000'
                            : info?.result === 'No Match Found'
                                ? '008000'
                                : '000000';

                    return new TableRow({
                        height: {
                            value: 400,
                            rule: 'atLeast',
                        },
                        children: [
                            this.createStandardCell(info?.category, 25,true,'bfbfbf'),
                            this.createStandardCell(
                                info?.result,
                                25,
                                false,
                                'FFFFFF',
                                22,
                                resultColor
                            ),
                            this.createStandardCell(info?.tags, 25),
                            this.createStandardCell(info?.actions || '-', 25),
                        ],
                    });
                }),
            ],
        });

        return [sectionHeader,table];
    }

    private createRiskCategoryTables(riskCategories: any[]) {
        return (riskCategories || [])
            .filter((info) => info?.result === 'Match Found')
            .map((info) => {
                return [
                    new Table({
                        ...this.STANDARD_TABLE_STYLE,
                        rows: [
                            new TableRow({
                                children: [
                                    this.createStandardCell(
                                        'Category',
                                        30,
                                        true,
                                        '#800000',
                                        24,
                                        'FFFFFF'
                                    ),
                                    this.createStandardCell(
                                        info?.category,
                                        70,
                                        true,
                                        '#800000',
                                        24,
                                        'FFFFFF'
                                    ),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    this.createStandardCell(
                                        'Match Found Under',
                                        30,
                                        true,
                                        '#800000',
                                        22,
                                        'FFFFFF'
                                    ),
                                    this.createStandardCell(
                                        info?.tags || '-',
                                        70,
                                        true,
                                        'FFFFFF',
                                        22,
                                        '000000'
                                    ),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        columnSpan: 2,
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.LEFT,
                                                children: [
                                                    new TextRun({
                                                        text:
                                                            info?.description ||
                                                            'No additional details available.',
                                                        size: 22,
                                                    }),
                                                ],
                                            }),
                                        ],
                                        borders: this.STANDARD_BORDERS,
                                        verticalAlign: VerticalAlign.CENTER,
                                        shading: { fill: 'FFFFFF' },
                                    }),
                                ],
                            }),
                        ],
                    }),
                ];
            });
    }

    private BottomStaticSection() {
        return [
            new Paragraph({
                children: [
                    new TextRun({
                        text: 'Glossary',
                        bold: true,
                        size: 32,
                        color: '000000',
                        underline: {},
                    }),
                ],
            }),
            ...this.createDefinitionCriteriaTable(),
            ...this.createChecksCoveredTable(),
            this.createFinancialTermsTable(),
        ];
    }

    private createDefinitionCriteriaTable() {
        const title = new Paragraph({
            children: [
                new TextRun({
                    text: 'Annexure - Definition Criteria',
                    bold: true,
                    color: 'A52A2A',
                    size: 26,
                }),
            ],
            spacing: { before: 200, after: 200 },
        });

        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            borders: {
                ...this.STANDARD_BORDERS,
                insideHorizontal: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: '#000000',
                },
                insideVertical: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: '#000000',
                },
            },
            rows: [
                new TableRow({
                    children: [
                        this.createStandardCell(
                            'Particulars',
                            30,
                            true,
                            'dbe5f1'
                        ),
                        this.createStandardCell(
                            'Our Evaluation Criteria',
                            70,
                            true,
                            'dbe5f1'
                        ),
                    ],
                }),
                this.createDefinitionRow(
                    'Background Risk Band',
                    'The Risk band is identified post scope of work is executed of all information available about the entity through public domain and regulators. This describes the risk on the basis of the current and historical standing of the entity.'
                ),

                this.createDefinitionRow(
                    'Sustainability Risk Band',
                    'The Risk band is identified post assessment of information of the entity evaluated along with proprietary factors underlined in Management, Operations, Finance, Legal and Compliance. The listed parameters outline potential future business sustainability risk of the entity by analyzing current and historical facts to make analytical predictions about future or otherwise unknown events.'
                ),

                this.createDefinitionRow(
                    'Match Found',
                    'would mean that EISI Team has found non-compliance or deviation from Compliance for that specific sub-parameter.'
                ),

                this.createDefinitionRow(
                    'Partial Match Found',
                    'would mean that EISI Team has found non-compliance or deviation from Compliance for that specific sub-parameter on account of common names and non-availability of additional information to cross verify the same.'
                ),

                this.createDefinitionRow(
                    'No Match Found',
                    'means that EISI Team has not found any non-compliance or deviation from compliance for that specific sub-parameter.'
                ),

                this.createDefinitionRow(
                    'Not Available',
                    'EISI team has found the particular parameter is inapplicable to the assessed entity'
                ),
            ],
        });

        return [
            title,
            table,
            new Paragraph({
                text: '',
                spacing: { before: 200, after: 200 },
            }),
        ];
    }

    private createDefinitionRow(term: string, definition: string) {
        return new TableRow({
            children: [
                this.createStandardCell(term, 30, true),
                this.createParagraphCell(definition, 70),
            ],
        });
    }

    private createParagraphCell(
        text: string,
        widthPercentage: number,
        bgColor: string = 'FFFFFF'
    ) {
        return new TableCell({
            margins: {
                top: 50,
                bottom: 50,
                left: 30,
                right: 30,
            },
            width: {
                size: widthPercentage,
                type: WidthType.PERCENTAGE,
            },
            children: [
                new Paragraph({
                    alignment: AlignmentType.LEFT,
                    spacing: { before: 100, after: 100 },
                    children: [
                        new TextRun({
                            text: this.safeString(text),
                            size: 22,
                        }),
                    ],
                }),
            ],
            borders: this.STANDARD_BORDERS,
            verticalAlign: VerticalAlign.CENTER,
            shading: {
                fill: bgColor,
            },
        });
    }

    private createChecksCoveredTable() {
        const title = new Paragraph({
            children: [
                new TextRun({
                    text: 'Annexure - Checks Covered',
                    bold: true,
                    color: 'A52A2A',
                    size: 26,
                }),
            ],
            spacing: { before: 200, after: 200 },
        });

        const table = new Table({
            ...this.STANDARD_TABLE_STYLE,
            borders: {
                ...this.STANDARD_BORDERS,
                insideHorizontal: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: '#000000',
                },
                insideVertical: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: '#000000',
                },
            },
            rows: [
                new TableRow({
                    children: [
                        this.createStandardCell(
                            'Particulars',
                            30,
                            true,
                            'dbe5f1'
                        ),
                        this.createStandardCell(
                            'Source & Subscriptions covered',
                            70,
                            true,
                            'dbe5f1'
                        ),
                    ],
                }),
                ...this.createMergedRow(
                    'Legal Assessments',
                    [
                        this.createLabeledTextCell(
                            'India',
                            'Supreme Court | State High Court | District High Court| Independent Checks (Subscribed Sources)',
                            'FFFFFF'
                        ),
                        this.createLabeledTextCell(
                            'International',
                            'Country Specific Courts and legislation Bodies',
                            'FFFFFF'
                        ),
                    ],
                    2
                ),

                ...this.createMergedRow(
                    'Taxation Diligence',
                    [
                        this.createLabeledTextCell(
                            'India',
                            'GST| ITAT | CESTAT |Indirect Taxes | Income Tax Appellate Tribunal |Income Tax Defaulters | Corporate/Income tax | Sales tax | Excise & custom | wealth taxes)',
                            'FFFFFF'
                        ),
                        this.createLabeledTextCell(
                            'International',
                            'Regulatory and Statutory Body as Per State & Country Jurisdiction',
                            'FFFFFF'
                        ),
                    ],
                    2
                ),

                this.createChecklistRow('Defaults & Delays', [
                    'Website Notices of Regulatory Bodies, Statutory Bodies',
                    'EPF (Employee Provident Fund)',
                    'ESIC (Employee State Insurance Corporation)',
                    "Defaults & delay's filing status in GST",
                ]),

                this.createChecklistRow('Secretarial Assessments', [
                    'Company ROC filled Documents Assessment',
                    'KYC documents Assessment',
                    'Related Party Transactions',
                    'Ultimate Beneficiary Owner (UBO)',
                ]),

                ...this.createMergedRow(
                    'Political Exposure',
                    [
                        this.createLabeledTextCell(
                            'India',
                            'Member/Ex-Member of Rajya Sabha | Member Lok Sabha | Member of State Assembly | Members of Political Parties | Socially Influential Person',
                            'FFFFFF'
                        ),
                        this.createLabeledTextCell(
                            'International',
                            'Member of International Parliament Committees, Queen & King Benches, Administration Representation, International Body Representation, Country Specific Ambassador.',
                            'FFFFFF'
                        ),
                    ],
                    2
                ),

                this.createChecklistRow(
                    'Global Sanctions-',
                    [
                        'Arms Export Control Act (AECA) Debarred List',
                        'Individuals sanctioned evaders (UN-SDN listing), Investor watch screening,',
                        'United Nations and the Security Council Affairs Division (UNSPC)',
                        'US Department of Commerce, United Nations, and the Security Council Affairs Division (DPA)',
                        'Office of Foreign Assets Control (OFAC: FSE & SDN Listing)',
                        'Criminal and barred database (Red/Yellow/Orange Notices)',
                    ],
                    '1000 + Listing of Foreign Sanctions Evaders, Law and Regulatory Enforcement, Banking Board Defaults and Other General Bodies'
                ),

                this.createChecklistRow('Anti-Money Laundering & Bribery', [
                    'AML Scanner| International and Regional financial watchdog',
                    'Premium Screening Subscription',
                    'Adverse media reporting',
                    'POCA, FCPA, UK-Anti Bribery, FIU Guidelines,',
                    'Reviewing Investor watch and credit bureau litigation assessment.',
                ]),

                new TableRow({
                    children: [
                        this.createStandardCell('FIU & Blacklisted', 30, true),
                        new TableCell({
                            margins: {
                                top: 50,
                                bottom: 50,
                                left: 30,
                                right: 30,
                            },
                            width: {
                                size: 70,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    spacing: { before: 50, after: 50 },
                                    children: [
                                        new TextRun({
                                            text: 'Domestic and International Financial Intelligence Units- FINTRAC, AUSTRAC, TRACFIN, FIU-IND, GNECB- FIU, ROSF MON, SEPBLAC, UK NCA, FIN CEN',
                                            size: 22,
                                        }),
                                    ],
                                }),
                            ],
                            borders: this.STANDARD_BORDERS,
                            verticalAlign: VerticalAlign.CENTER,
                        }),
                    ],
                }),

                this.createChecklistRow('Voluntary Reported Sources', [
                    'Glassdoor, Business Review Sites',
                    'Default reported by Corporate Entities,',
                    'Blacklisted Customers and Supplier Listing',
                    'Social media screening',
                ]),

                this.createChecklistRow('Tier 2 Related Party Assessment', [
                    'Vendor tier 2 portfolio Assessment',
                    'Sub-Supplier, customer & Sub-Distributor Assessment',
                    'Conflict of Interest Assessment- Business Entities & Employees',
                ]),

                this.createChecklistRow('Adverse Media Screening', [
                    "Adverse Media Assessment- With respect to 'defamation' 'Fraud' 'bribery' 'corruption' 'Criminal' 'Politics' and 20 other keywords - Performed in 60+ local languages and through regional media sources",
                    'Politically affiliated & socially influential person',
                    'International screening through county specific search engines',
                ]),

                this.createChecklistRow('Operational & Financial Default', [
                    'Status of NCLT jurisdictions (Insolvency & Bankruptcy Code)',
                    'Financial Checks - Identification through audited Financial statements and auditor reports',
                ]),

                this.createChecklistRow('Credit & Tax Default', [
                    'Case status report of Debts Recovery Appellate Tribunals (DRATs) & debts recovery tribunal (DRT)',
                    'Commodity & Stock Exchange Defaulters',
                    'Intelligence Bureau, Credit Default Checks - Public Domain Assessment Statutory Tax Defaults',
                    'Credit Bureau suits filed (CIBIL) willful defaulters',
                ]),

                this.createChecklistRow('Consumer Disputes', [
                    'Consumer disputes | International Jurisdiction',
                    'NCDRC - District/State/National level, independent search in consumer forum listing',
                    'Media screening in respect to consumers complaints',
                    'View Complaint - Jago Grahak Jago',
                    'Track Complaint – Consumer Samasya',
                ]),

                this.createChecklistRow('Regulatory Defaults', [
                    "ROC-MCA, SEBI, NSE, BSE, RBI defaulter's screening to identify red flags",
                    'AML/CFT Master Circular issued by Reserve Bank of India, SEBI, IRDA, Income Tax Authority, CBI & FBI from time to time',
                    'Company Register Defaulters | State Business Defaulters',
                ]),

                new TableRow({
                    children: [
                        this.createStandardCell(
                            "Blacklisted & Suspended NGO's and Trusts",
                            30,
                            true
                        ),
                        new TableCell({
                            margins: {
                                top: 50,
                                bottom: 50,
                                left: 30,
                                right: 30,
                            },
                            width: {
                                size: 70,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    spacing: { before: 50, after: 50 },
                                    children: [
                                        new TextRun({
                                            text: 'State wise List of Blacklisted NGOs |International Defaulting NGOs| Registered Business Trust (As on date)',
                                            size: 22,
                                        }),
                                    ],
                                }),
                            ],
                            borders: this.STANDARD_BORDERS,
                            verticalAlign: VerticalAlign.CENTER,
                        }),
                    ],
                }),
            ],
        });

        return [
            title,
            table,
            new Paragraph({
                text: '',
                spacing: { before: 200, after: 200 },
            }),
        ];
    }

    private createMergedRow(
        label: string,
        contentCells: TableCell[],
        rowSpan: number
    ): TableRow[] {
        const cells = [
            new TableCell({
                rowSpan: rowSpan,
                margins: {
                    top: 50,
                    bottom: 50,
                    left: 30,
                    right: 30,
                },
                width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                },
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 100, after: 100 },
                        children: [
                            new TextRun({
                                text: this.safeString(label),
                                size: 22,
                                bold: true,
                            }),
                        ],
                    }),
                ],
                borders: this.STANDARD_BORDERS,
                verticalAlign: VerticalAlign.CENTER,
            }),
            contentCells[0],
        ];

        const rows: TableRow[] = [new TableRow({ children: cells })];

        for (let i = 1; i < rowSpan && i < contentCells.length; i++) {
            rows.push(
                new TableRow({
                    children: [contentCells[i]],
                })
            );
        }

        return rows;
    }

    private createLabeledTextCell(
        label: string,
        text: string,
        bgColor: string = 'FFFFFF'
    ) {
        return new TableCell({
            margins: {
                top: 50,
                bottom: 50,
                left: 30,
                right: 30,
            },
            width: {
                size: 70,
                type: WidthType.PERCENTAGE,
            },
            children: [
                new Paragraph({
                    alignment: AlignmentType.LEFT,
                    spacing: { before: 100, after: 100 },
                    children: [
                        new TextRun({
                            text: label + ': ',
                            size: 22,
                            bold: true,
                        }),
                        new TextRun({
                            text: this.safeString(text),
                            size: 22,
                        }),
                    ],
                }),
            ],
            borders: this.STANDARD_BORDERS,
            verticalAlign: VerticalAlign.CENTER,
            shading: {
                fill: bgColor,
            },
        });
    }

    private createChecklistRow(
        label: string,
        items: string[],
        header: string = ''
    ) {
        const paragraphs = [];

        if (header) {
            paragraphs.push(
                new Paragraph({
                    alignment: AlignmentType.LEFT,
                    spacing: { before: 80, after: 60 },
                    children: [
                        new TextRun({
                            text: header,
                            bold: true,
                            size: 22,
                        }),
                    ],
                })
            );
        }

        items.forEach((item) => {
            paragraphs.push(
                new Paragraph({
                    alignment: AlignmentType.LEFT,
                    spacing: { before: 60, after: 60 },
                    children: [
                        new TextRun({
                            text: '✓    ' + item,
                            size: 22,
                        }),
                    ],
                })
            );
        });

        return new TableRow({
            children: [
                this.createStandardCell(label, 30, true),
                new TableCell({
                    margins: {
                        top: 50,
                        bottom: 50,
                        left: 30,
                        right: 30,
                    },
                    width: {
                        size: 70,
                        type: WidthType.PERCENTAGE,
                    },
                    children: paragraphs,
                    borders: this.STANDARD_BORDERS,
                    verticalAlign: VerticalAlign.CENTER,
                }),
            ],
        });
    }

    private createFinancialTermsTable() {
        const rows: TableRow[] = [];

        new Paragraph({ text: '', pageBreakBefore: true });
        rows.push(
            this.createTableHeaderRow(
                'Definition of Financial Terms used',
                3,
                24,
                '#E0E0E0',
                '#c00000'
            )
        );

        rows.push(
            new TableRow({
                children: [
                    this.createStandardCell(
                        'Terminology',
                        30,
                        true,
                        '#a6a6a6',
                        22,
                        'FFFFFF'
                    ),
                    this.createStandardCell(
                        'Definition',
                        50,
                        true,
                        '#a6a6a6',
                        22,
                        'FFFFFF'
                    ),
                    this.createStandardCell(
                        'Formula',
                        20,
                        true,
                        '#a6a6a6',
                        22,
                        'FFFFFF'
                    ),
                ],
                cantSplit: true,
            })
        );

        const tableData = [
            [
                'Turnover',
                'Overall revenue from the core operations of the entity.',
                'Total Revenue from sale of products and/or services',
            ],
            [
                'Cost of Goods Sold',
                'Cost of acquiring or manufacturing the products that a company sells during a period.',
                'Opening Inventory + Purchases + Direct Expenses – Closing Inventory',
            ],
            [
                'Operating Profit/EBIT',
                "Company's ability to generate earnings from operations, ignoring variables such as the tax and finance cost.",
                'Gross Profit - Indirect expenses (excluding interest and taxes)',
            ],
            [
                'Net Profit',
                'Profit from the business after deducting cost of goods sold, Expenses, Interest costs and Taxes from sales.',
                'Gross Profit – Indirect expenses including interest and tax burden',
            ],
            [
                'Net Profit Margin',
                'Profit margins of the entity as % of total sales.',
                'Net Profit / Sales * 100',
            ],
            [
                'Current Assets',
                'Entity holds the assets primarily for the purpose of trading, 12 months cycle. Comprises of Stock, debtors, cash etc.',
                'Sum of Total Current Assets',
            ],
            [
                'Current Liabilities',
                'Entity holds the liability primarily for the purpose of trading, to be settled within 12 months. Comprises of trade payables and short-term borrowings.',
                'Sum of Total Current Liabilities',
            ],
            [
                'Working Capital (WC)',
                'Excess of Current Assets over Current Liabilities, gauges the short-term liquidity position.',
                'Current Assets - Current Liabilities',
            ],
            [
                'Current Ratio',
                'Measures liquidity Position of the entity, higher the better.',
                'Current Assets / Current Liabilities',
            ],
            [
                'Interest Coverage Ratio',
                "Indicates the adequacy of the operating profits to cover the entity's interest obligations. The higher, the better.",
                'Earnings before Interest and Tax / Interest expenses',
            ],
            [
                'Equity/Stock',
                'Own funds brought in by the entity. Also referred to as Net worth / Capital Account.',
                'Capital + Reserves & Surplus - Intangible assets if any',
            ],
            [
                'Debt',
                'Total outsider liabilities of the entity. Can be loans, cash credit, overdraft payables, etc.',
                'Total outsider liabilities',
            ],
            [
                'Debt Equity Ratio',
                'It refers to the proportion of Debt (borrowings) to the Equity brought in by the promoter. The lower the better.',
                'Total Debt / Equity',
            ],
            [
                'Capital Gearing Ratio',
                'Relationship between equity and fixed interest-bearing funds, measurement of financial risk.',
                'Equity share capital + Reserves and Surplus / Fixed interest-bearing funds',
            ],
            [
                'Return on Net worth',
                'Refers to extent of profits generated with owned funds. The higher the better.',
                'Profit after Tax / Net worth * 100',
            ],
            [
                'Return on Capital Employed',
                'Refers to profits generated with total investment (owned and borrowed funds). The higher the better.',
                'Earnings before Interest and Tax / (Net worth + Debt) * 100',
            ],
            [
                'Collection Period',
                'Indicates the Collection days from debtors, Industry Specific.',
                'Net Credit Sales / Average Account Receivable * 365',
            ],
            [
                'Payable Period',
                'Indicates the payment cycle to the creditors, Industry Specific.',
                'Net Credit Purchases / Average Account Payables * 365',
            ],
            [
                'Inventory Holding Period',
                'Number of days on average that a business holds inventory, indicates the obsolescence, maintenance cost etc.',
                'Average Inventory / Cost of Sales * 365',
            ],
            [
                'Gross Profit',
                'Profit of the business after deducting direct costs from Sales.',
                'Turnover from Operations – Cost of Goods Sold',
            ],
            [
                'Gross Profit Margin',
                'Gross Profit shown as a % of sales.',
                'Gross Profit / Sales * 100',
            ],
            [
                'Zeta Score',
                'Indicates the chances of bankruptcy in future.',
                '1.2WC / TA + 1.4RE / TA + 3.3EBIT / TA + 0.6MVE / TL + Sales / TA',
            ],
            [
                'Du-Pont',
                'Financial activities are contributing the most to the changes in ROE.',
                'Net Profit Margin × Asset Turnover × Multiplier',
            ],
        ];

        for (const row of tableData) {
            rows.push(
                new TableRow({
                    children: [
                        this.createStandardCell(row[0], 15, true),
                        this.createStandardCell(row[1], 45),
                        this.createStandardCell(row[2], 40),
                    ],
                    cantSplit: true,
                })
            );
        }

        return new Table({
            ...this.STANDARD_TABLE_STYLE,
            width: { size: 100, type: WidthType.PERCENTAGE },
            layout: TableLayoutType.FIXED,
            columnWidths: [30, 50, 20],
            rows,
        });
    }

    private createEndOfReportPage(mainLogoUint8Array) {
        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            },
            rows: [
                ...Array(40).fill(
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph('')],
                                columnSpan: 2,
                                borders: {
                                    top: {
                                        style: BorderStyle.NONE,
                                        size: 0,
                                        color: 'FFFFFF',
                                    },
                                    bottom: {
                                        style: BorderStyle.NONE,
                                        size: 0,
                                        color: 'FFFFFF',
                                    },
                                    left: {
                                        style: BorderStyle.NONE,
                                        size: 0,
                                        color: 'FFFFFF',
                                    },
                                    right: {
                                        style: BorderStyle.NONE,
                                        size: 0,
                                        color: 'FFFFFF',
                                    },
                                },
                            }),
                        ],
                    })
                ),

                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new TextRun({
                                            text: '**End of Report**',
                                            size: 22,
                                            font: 'Calibri',
                                        }),
                                    ],
                                }),
                                new Paragraph(''),
                            ],
                            columnSpan: 2,
                            borders: {
                                top: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                                bottom: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                                left: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                                right: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                            },
                        }),
                    ],
                }),

                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: 'Empliance Technologies Private Limited\n',
                                            bold: true,
                                            size: 24,
                                            font: 'Calibri',
                                        }),
                                        new TextRun({ break: 1 }),
                                        new TextRun({
                                            text: 'HD-104, WeWork DLF Forum, Cybercity, Phase-III, Gurugram\nGurgaon HR 122002, India\n',
                                            size: 24,
                                            font: 'Calibri',
                                        }),
                                        new TextRun({
                                            text: 'info@empliance.in, Contact Number: +91 22 4960 4040',
                                            size: 24,
                                            font: 'Calibri',
                                        }),
                                    ],
                                }),
                                new Paragraph(''),
                                new Paragraph(''),
                            ],

                            width: { size: 65, type: WidthType.PERCENTAGE },
                            borders: {
                                top: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                                bottom: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                                left: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                                right: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                            },
                        }),

                        new TableCell({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.RIGHT,
                                    children: [
                                        new ImageRun({
                                            data: mainLogoUint8Array,
                                            transformation: {
                                                width: 200,
                                                height: 60,
                                            },
                                            type: 'png',
                                        }),
                                    ],
                                }),
                                new Paragraph(''),
                                new Paragraph(''),
                            ],
                            width: { size: 35, type: WidthType.PERCENTAGE },
                            borders: {
                                top: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                                bottom: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                                left: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                                right: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                            },
                        }),
                    ],
                }),

                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: 'Any queries regarding the report & its content, you can contact ',
                                            size: 24,
                                            font: 'Calibri',
                                        }),
                                        new TextRun({
                                            text: 'operations team',
                                            underline: {},
                                            bold: true,
                                            color: '0000FF',
                                            size: 24,
                                            font: 'Calibri',
                                        }),
                                        new TextRun({
                                            text: ' at Empliance India. © 2025 All Rights Reserved.',
                                            size: 24,
                                            font: 'Calibri',
                                        }),
                                    ],
                                    alignment: AlignmentType.LEFT,
                                }),
                            ],
                            columnSpan: 2,
                            borders: {
                                top: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                                bottom: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                                left: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                                right: {
                                    style: BorderStyle.NONE,
                                    size: 0,
                                    color: 'FFFFFF',
                                },
                            },
                        }),
                    ],
                }),
            ],
        });
    }
}
