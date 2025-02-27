/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace initialfantasy {
    export namespace ui {
        export namespace c {
            /** 变量-用户ID */
            const VARIABLE_NAME_USER_ID: string = "${USER_ID}";
            /** 变量-用户归属 */
            const VARIABLE_NAME_USER_BELONG: string = "${USER_BELONG}";
            /** 变量-用户编码 */
            const VARIABLE_NAME_USER_CODE: string = "${USER_CODE}";
            /** 变量-用户名称 */
            const VARIABLE_NAME_USER_NAME: string = "${USER_NAME}";
            /** 变量-用户身份 */
            const VARIABLE_NAME_USER_IDENTITIES: string = "${USER_IDENTITIES}";
            /** 视图-BOFiltering */
            export class BOFilteringEditView extends ibas.BOEditView implements app.IBOFilteringEditView {
                /** 删除数据事件 */
                deleteDataEvent: Function;
                /** 新建数据事件，参数1：是否克隆 */
                createDataEvent: Function;
                /** 添加业务对象筛选-条件事件 */
                addBOFilteringConditionEvent: Function;
                /** 删除业务对象筛选-条件事件 */
                removeBOFilteringConditionEvent: Function;
                /** 选择角色事件 */
                chooseRoleEvent: Function;
                /** 选择业务对象事件 */
                chooseBusinessObjectEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    let formTop: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("initialfantasy_title_general") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_bofiltering_name") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "name",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 30
                                })
                            }),
                            new sap.extension.m.EnumSelect("", {
                                enumType: bo.emFilteringCategory
                            }).bindProperty("bindingValue", {
                                path: "category",
                                type: new sap.extension.data.Enum({
                                    enumType: bo.emFilteringCategory
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_bofiltering_bocode") }),
                            new sap.extension.m.RepositoryInput("", {
                                showValueHelp: true,
                                repository: bo.BORepositoryInitialFantasy,
                                dataInfo: {
                                    type: bo.BOInformation,
                                    key: bo.BOInformation.PROPERTY_CODE_NAME,
                                    text: bo.BOInformation.PROPERTY_DESCRIPTION_NAME
                                },
                                valueHelpRequest: function (): void {
                                    that.fireViewEvents(that.chooseBusinessObjectEvent);
                                }
                            }).bindProperty("bindingValue", {
                                path: "boCode",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 30
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_bofiltering_rolecode") }),
                            new sap.extension.m.RepositoryInput("", {
                                showValueHelp: true,
                                repository: bo.BORepositoryInitialFantasy,
                                dataInfo: {
                                    type: bo.Organization,
                                    key: bo.Organization.PROPERTY_CODE_NAME,
                                    text: bo.Organization.PROPERTY_NAME_NAME
                                },
                                valueHelpRequest: function (): void {
                                    that.fireViewEvents(that.chooseRoleEvent);
                                }
                            }).bindProperty("bindingValue", {
                                path: "roleCode",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 8
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_bofiltering_activated") }),
                            new sap.extension.m.EnumSelect("", {
                                enumType: ibas.emYesNo
                            }).bindProperty("bindingValue", {
                                path: "activated",
                                type: new sap.extension.data.YesNo()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_bofiltering_filteringtype") }),
                            new sap.extension.m.EnumSelect("", {
                                enumType: bo.emFilteringType
                            }).bindProperty("bindingValue", {
                                path: "filteringType",
                                type: new sap.extension.data.Enum({
                                    enumType: bo.emFilteringType
                                })
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("initialfantasy_title_others") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_bofiltering_objectkey") }),
                            new sap.extension.m.Input("", {
                                enabled: false,
                                type: sap.m.InputType.Number
                            }).bindProperty("bindingValue", {
                                path: "objectKey",
                                type: new sap.extension.data.Numeric()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_identity_remarks") }),
                            new sap.extension.m.TextArea("", {
                                rows: 3,
                            }).bindProperty("bindingValue", {
                                path: "remarks",
                                type: new sap.extension.data.Alphanumeric()
                            }),
                        ]
                    });
                    let formMiddle: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_bofilteringcondition") }),
                            this.tableBOFilteringCondition = new sap.extension.table.DataTable("", {
                                enableSelectAll: false,
                                visibleRowCount: sap.extension.table.visibleRowCount(8),
                                dataInfo: {
                                    code: bo.BOFiltering.BUSINESS_OBJECT_CODE,
                                    name: bo.BOFilteringCondition.name
                                },
                                toolbar: new sap.m.Toolbar("", {
                                    content: [
                                        new sap.m.Button("", {
                                            text: ibas.i18n.prop("shell_data_add"),
                                            type: sap.m.ButtonType.Transparent,
                                            icon: "sap-icon://add",
                                            press: function (): void {
                                                that.fireViewEvents(that.addBOFilteringConditionEvent);
                                            }
                                        }),
                                        new sap.m.Button("", {
                                            text: ibas.i18n.prop("shell_data_remove"),
                                            type: sap.m.ButtonType.Transparent,
                                            icon: "sap-icon://less",
                                            press: function (): void {
                                                that.fireViewEvents(that.removeBOFilteringConditionEvent, that.tableBOFilteringCondition.getSelecteds());
                                            }
                                        })
                                    ]
                                }),
                                rows: "{/rows}",
                                columns: [
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_bofilteringcondition_relationship"),
                                        template: new sap.extension.m.EnumSelect("", {
                                            enumType: bo.emConditionRelationship
                                        }).bindProperty("bindingValue", {
                                            path: "relationship",
                                            type: new sap.extension.data.Enum({
                                                enumType: bo.emConditionRelationship,
                                            })
                                        })
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_bofilteringcondition_bracketopen"),
                                        template: new sap.extension.m.RepeatCharSelect("", {
                                            repeatText: "(",
                                            maxCount: 5,
                                        }).bindProperty("bindingValue", {
                                            path: "bracketOpen",
                                            type: "sap.ui.model.type.Integer"
                                        })
                                    }),
                                    this.columnProperty = new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_bofilteringcondition_propertyname"),
                                        template: new sap.extension.m.Select("", {
                                        }).bindProperty("bindingValue", {
                                            path: "propertyName",
                                            type: new sap.extension.data.Alphanumeric()
                                        }),
                                        width: "12rem",
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_bofilteringcondition_operation"),
                                        template: new sap.extension.m.EnumSelect("", {
                                            enumType: bo.emConditionOperation
                                        }).bindProperty("bindingValue", {
                                            path: "operation",
                                            type: new sap.extension.data.Enum({
                                                enumType: bo.emConditionOperation
                                            })
                                        })
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_bofilteringcondition_conditionvalue"),
                                        template: new sap.extension.m.Input("", {
                                            showSuggestion: true,
                                            suggestionItems: [
                                                new sap.ui.core.Item("", {
                                                }).setText(VARIABLE_NAME_USER_ID),
                                                new sap.ui.core.Item("", {
                                                }).setText(VARIABLE_NAME_USER_CODE),
                                                new sap.ui.core.Item("", {
                                                }).setText(VARIABLE_NAME_USER_NAME),
                                                new sap.ui.core.Item("", {
                                                }).setText(VARIABLE_NAME_USER_BELONG),
                                            ]
                                        }).bindProperty("bindingValue", {
                                            path: "conditionValue",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 30
                                            })
                                        }),
                                        width: "10rem",
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_bofilteringcondition_bracketclose"),
                                        template: new sap.extension.m.RepeatCharSelect("", {
                                            repeatText: ")",
                                            maxCount: 5,
                                        }).bindProperty("bindingValue", {
                                            path: "bracketClose",
                                            type: "sap.ui.model.type.Integer"
                                        })
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_bofilteringcondition_remarks"),
                                        template: new sap.extension.m.Input("", {
                                        }).bindProperty("bindingValue", {
                                            path: "remarks",
                                            type: new sap.extension.data.Alphanumeric()
                                        }),
                                        width: "16rem",
                                    }),
                                ]
                            }),
                        ]
                    });
                    return this.page = new sap.extension.m.DataPage("", {
                        showHeader: false,
                        dataInfo: {
                            code: bo.BOFiltering.BUSINESS_OBJECT_CODE,
                        },
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_save"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://save",
                                    press: function (): void {
                                        that.fireViewEvents(that.saveDataEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_delete"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://delete",
                                    press: function (): void {
                                        that.fireViewEvents(that.deleteDataEvent);
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.MenuButton("", {
                                    text: ibas.strings.format("{0}/{1}",
                                        ibas.i18n.prop("shell_data_new"), ibas.i18n.prop("shell_data_clone")),
                                    icon: "sap-icon://create",
                                    type: sap.m.ButtonType.Transparent,
                                    menu: new sap.m.Menu("", {
                                        items: [
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("shell_data_new"),
                                                icon: "sap-icon://create",
                                                press: function (): void {
                                                    // 创建新的对象
                                                    that.fireViewEvents(that.createDataEvent, false);
                                                }
                                            }),
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("shell_data_clone"),
                                                icon: "sap-icon://copy",
                                                press: function (): void {
                                                    // 复制当前对象
                                                    that.fireViewEvents(that.createDataEvent, true);
                                                }
                                            }),
                                        ],
                                    })
                                }),
                            ]
                        }),
                        content: [
                            formTop,
                            formMiddle,
                        ]
                    });
                }
                private page: sap.extension.m.Page;
                private tableBOFilteringCondition: sap.extension.table.Table;
                private columnProperty: sap.extension.table.DataColumn;
                /** 显示数据 */
                showBOFiltering(data: bo.BOFiltering): void {
                    this.page.setModel(new sap.extension.model.JSONModel(data));
                    // 改变页面状态
                    sap.extension.pages.changeStatus(this.page);
                    // 加载可选项
                    let criteria: ibas.ICriteria = new ibas.Criteria();
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = initialfantasy.bo.BOInformation.PROPERTY_CODE_NAME;
                    condition.value = data.boCode;
                    let boRepository: initialfantasy.bo.BORepositoryInitialFantasy = new initialfantasy.bo.BORepositoryInitialFantasy();
                    boRepository.fetchBOInformation({
                        criteria: criteria,
                        onCompleted: (opRslt) => {
                            let template: sap.extension.m.Select = new sap.extension.m.Select("", {
                                items: [
                                    new sap.ui.core.ListItem("", {
                                        key: "",
                                        text: ibas.i18n.prop("shell_please_chooose_data", ""),
                                    })
                                ]
                            }).bindProperty("bindingValue", {
                                path: "propertyName",
                                type: new sap.extension.data.Alphanumeric()
                            });
                            let boInfo: initialfantasy.bo.IBOInformation = opRslt.resultObjects.firstOrDefault();
                            if (boInfo && boInfo.boPropertyInformations instanceof Array) {
                                for (let property of boInfo.boPropertyInformations) {
                                    if (property.editSize < 0) {
                                        // 对象类型属性跳过
                                        continue;
                                    }
                                    template.addItem(new sap.ui.core.ListItem("", {
                                        key: property.mapped,
                                        text: property.description,
                                    }));
                                }
                            }
                            // 系统变量
                            template.addItem(new sap.ui.core.ListItem("", {})
                                .setKey(VARIABLE_NAME_USER_ID)
                                .setText(ibas.i18n.prop("bo_bofilteringcondition_propertyname_user_id"))
                            );
                            template.addItem(new sap.ui.core.ListItem("", {})
                                .setKey(VARIABLE_NAME_USER_CODE)
                                .setText(ibas.i18n.prop("bo_bofilteringcondition_propertyname_user_code"))
                            );
                            template.addItem(new sap.ui.core.ListItem("", {})
                                .setKey(VARIABLE_NAME_USER_NAME)
                                .setText(ibas.i18n.prop("bo_bofilteringcondition_propertyname_user_name"))
                            );
                            template.addItem(new sap.ui.core.ListItem("", {})
                                .setKey(VARIABLE_NAME_USER_BELONG)
                                .setText(ibas.i18n.prop("bo_bofilteringcondition_propertyname_user_belong"))
                            );
                            template.addItem(new sap.ui.core.ListItem("", {})
                                .setKey(VARIABLE_NAME_USER_IDENTITIES)
                                .setText(ibas.i18n.prop("bo_bofilteringcondition_propertyname_user_identities"))
                            );
                            this.columnProperty.setTemplate(template);
                        }
                    });
                }
                /** 显示数据-业务对象筛选-条件 */
                showBOFilteringConditions(datas: bo.BOFilteringCondition[]): void {
                    this.tableBOFilteringCondition.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                }
            }
        }
    }
}