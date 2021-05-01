// /* jshint indent: 1 */

// module.exports = function (sequelize, DataTypes) {
//   return sequelize.define(
//     "comment",
//     {
//       id: {
//         type: DataTypes.INTEGER(10).UNSIGNED,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       userId: {
//         type: DataTypes.INTEGER(10).UNSIGNED,
//         allowNull: false,
//         references: {
//           model: "user",
//           key: "id",
//         },
//       },
//       bookId: {
//         type: DataTypes.INTEGER(10).UNSIGNED,
//         allowNull: false,
//         references: {
//           model: "book",
//           key: "id",
//         },
//       },
//       comment: {
//         type: DataTypes.STRING(450),
//         allowNull: false,
//       },
//     },
//     {
//       tableName: "comment",
//       timestamps: true,
//     }
//   );
// };
